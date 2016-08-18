node('master') {
  def awsRegion = env.AWS_REGION
  def projectName = 'thedevelopingdeveloper.com' // No way to get this from env without parsing Strings... seems a bit silly.
  def wwwProjectName = "www.${projectName}"
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


  // Only deploy if this is the master branch. We don't want to deploy anything else (right now)
  if (isMaster) {
    stage 'Create S3 buckets if they don\'t already exist'
    sh """#!/bin/bash
    for s3_bucket in ${projectName} ${wwwProjectName};
    do
      aws s3api list-buckets --query \"Buckets[?Name==\\`\\"\$s3_bucket\\"\\`].Name\" --output text;
      __result=\$?;
      if [[ \$__result == 0 ]];
      then
        echo \"\$s3_bucket S3 bucket found. Proceeding...\";
      else
        echo \"\$s3_bucket S3 bucket not found. Creating...\";
        aws s3 mb s3://\"\$s3_bucket\";
        echo \"\$s3_bucket S3 bucket created successfully. Proceeding...\";
      fi;
    done;
    """


    stage 'Upload build to S3'
    sh "aws s3 sync \"${tmpFolder}${distFolder}\" s3://\"${projectName}\"/"


    stage 'Configure S3 buckets - naked domain as website, www as redirect'
    sh "aws s3api put-bucket-website --bucket ${projectName} --website-configuration file://aws-resources/${projectName}.website-config.json"
    sh "aws s3api put-bucket-website --bucket ${wwwProjectName} --website-configuration file://aws-resources/${wwwProjectName}.website-config.json"


    stage 'Make S3 bucket browsable by all'
    sh "aws s3api put-bucket-policy --bucket ${projectName} --policy file://aws-resources/${projectName}.policy.json"


    stage "Create hosted zone for ${projectName} if it doesn't already exist"
    sh """#!/bin/bash
    __existing_hosted_zone=\$(aws route53 list-hosted-zones-by-name --dns-name ${projectName} --query HostedZones[0].Name --output text);
    if [[ \$__existing_hosted_zone == ${projectName}. ]];
    then
      echo \"${projectName} hosted zone exists. Proceeding...\";
    else
      echo \"${projectName} hosted zone not found. Creating...\";
      aws route53 create-hosted-zone --name ${projectName} --caller-reference \$(date +%Y%m%d_%H%M%S_%N);
      echo \"${projectName} hosted zone created successfully. Proceeding...\";
    fi;
    """


    stage 'Assign Route53 domain to S3 bucket for easy browsing'
    sh "aws route53 change-resource-record-sets --hosted-zone-id \$(aws route53 list-hosted-zones-by-name --dns-name ${projectName} --query 'HostedZones[0].Id' --output text) --change-batch file://aws-resources/dns-record-set.json"
  } else {
    // Need to do something here for branches maybe. Deploy to a staging environment?
  }
}
