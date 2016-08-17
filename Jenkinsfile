node('master') {
  def awsRegion = env.AWS_REGION
  def projectName = 'thedevelopingdeveloper' // No way to get this from env without parsing Strings... seems a bit silly.
  def distFolder = "/dist"
  def tmpFolder = "/tmp"
  def distFolderPath = "/home/app" + distFolder
  def isMaster = env.BRANCH_NAME == 'master';
  def safeBranchName = env.BRANCH_NAME.replace("origin/", "").replace("/", "_")


  stage 'Checkout code from VCS'
  checkout scm


  stage 'Docker Build'
  def img = docker.build "${projectName}:${safeBranchName}"


  stage 'Snarfle dist folder'
  def tempContainerName = "snarfle"
  img.withRun('--name="snarfle"') { container ->
     sh "docker cp ${tempContainerName}:${distFolderPath} ${tmpFolder}"
  }


  // Only deploy if this is the master branch. We don't want to deploy anything else
  if (isMaster) {
    stage 'Create S3 bucket if it doesn\'t already exist'
    sh """#!/bin/bash
    aws s3 ls | grep ${projectName};
    __result=\$?;
    if [[ \$__result == 0 ]];
    then
      echo \"${projectName} S3 bucket found. Proceeding...\";
    else
      echo \"${projectName} S3 bucket not found. Creating...\";
      aws s3 mb s3://\"${projectName}\";
      echo \"${projectName} S3 bucket created.\";
    fi;
    """


    stage 'Upload build to S3'
    sh "aws s3 cp --recursive \"${tmpFolder}${distFolder}\" s3://\"${projectName}\"/"


    stage 'Set S3 bucket as website'
    sh "aws s3 website s3://${projectName}/ --index-document index.html"


    stage 'Make S3 bucket browsable by all'
    sh "aws s3api put-bucket-policy --bucket ${projectName} --policy file://aws-resources/website-bucket-policy.json"


    stage 'Assign Route53 domain to S3 bucket for easy browsing'
    sh "aws change-resource-record-sets --hosted-zone-id $(aws route53 list-hosted-zones-by-name --dns-name will-roberts.uk --query 'HostedZones[].Id' --output text) --change-batch file://aws-resources/dns-record-set.json"
  } else {
    // Need to do something here for branches maybe. Deploy to a staging environment?
  }
}
