def checkExistenceOfS3Bucket(String bucketName) {
  def bucketExists = sh (
    script: "aws s3api list-buckets --query 'Buckets[?Name==`\"${bucketName}\"`].Name' --output text",
    returnStdout: true
    ).trim()
  return bucketExists == bucketName
}

def createS3BucketsForDomainsIfTheyDontAlreadyExist(String domain) {
  if (checkExistenceOfS3Bucket(domain)) {
    println domain + " S3 bucket found. Proceeding..."
  } else {
    println domain + " S3 bucket not found. Creating..."
    sh "aws s3 mb s3://\"${domain}\";"
    println domain + " S3 bucket created successfully. Proceeding..."
  }
}

def uploadDirToS3Bucket(String dirPath, String bucketName) {
  sh "aws s3 sync \"${dirPath}\" s3://\"${bucketName}\"/"
}

def configureS3BucketWebsiteConfig(String s3Bucket, String configFilePath) {
  sh "aws s3api put-bucket-website --bucket ${s3Bucket} --website-configuration file://${configFilePath}"
}

def configureS3BucketPolicy(String domain, String policyFilePath) {
  sh "aws s3api put-bucket-policy --bucket ${domain} --policy file://${policyFilePath}"
}


node('master') {
  def awsRegion = env.AWS_REGION
  def hostDomain = "thedevelopingdeveloper.com"
  String[] redirectDomains = [ "thedevelopingdeveloper.co.uk", "will-roberts.com", "will-roberts.co.uk", "will-roberts.uk" ]
  def distFolder = "/dist"
  def tmpFolder = "/tmp"
  def distFolderPath = "/home/app" + distFolder
  def isMaster = env.BRANCH_NAME == 'master';
  def safeBranchName = env.BRANCH_NAME.replace("origin/", "").replace("/", "_")
  def dockerImg;

  stage('Checkout code from VCS') {
    checkout scm
  }

  stage('Docker Build') {
    dockerImg = docker.build "${hostDomain}:${safeBranchName}"
  }

  stage('Snarfle dist folder') {
    def tempContainerName = "snarfle"
    dockerImg.withRun('--name="snarfle"') { container ->
       sh "docker cp ${tempContainerName}:${distFolderPath} ${tmpFolder}"
    }
  }

  // Only deploy if this is the master branch. We don't want to deploy anything else (right now)
  if (isMaster) {
    stage("Create S3 buckets if they don't already exist") {
      createS3BucketsForDomainsIfTheyDontAlreadyExist(hostDomain)
      createS3BucketsForDomainsIfTheyDontAlreadyExist("www.${hostDomain}")
      for(int i = 0; i < redirectDomains.size(); i++) {
        def redirectDomain = redirectDomains[i]
        createS3BucketsForDomainsIfTheyDontAlreadyExist(redirectDomain)
        createS3BucketsForDomainsIfTheyDontAlreadyExist("www.${redirectDomain}")
      }
    }

    stage('Upload build to S3') {
      uploadDirToS3Bucket(tmpFolder + distFolder, hostDomain)
    }

    stage('Configure S3 buckets - naked domain as website, www as redirect') {
      configureS3BucketWebsiteConfig(hostDomain, "aws-resources/host-domain.bucket-website-config.json")
      configureS3BucketWebsiteConfig("www.${hostDomain}", "aws-resources/redirect-domain.bucket-website-config.json")
      for(int i = 0; i < redirectDomains.size(); i++) {
        def redirectDomain = redirectDomains[i]
        configureS3BucketWebsiteConfig(redirectDomain, "aws-resources/redirect-domain.bucket-website-config.json")
        configureS3BucketWebsiteConfig("www.${redirectDomain}", "aws-resources/redirect-domain.bucket-website-config.json")
      }
    }

    stage('Make S3 bucket browsable by all') {
      configureS3BucketPolicy(hostDomain, "aws-resources/host-domain.bucket-policy.json")
    }

    stage('Assign Route53 domain to S3 bucket for easy browsing') {
      sh "aws route53 change-resource-record-sets --hosted-zone-id \$(aws route53 list-hosted-zones-by-name --dns-name ${hostDomain} --query 'HostedZones[0].Id' --output text) --change-batch file://aws-resources/${hostDomain}.dns-record-set.json"
      for(int i = 0; i < redirectDomains.size(); i++) {
        def redirectDomain = redirectDomains[i]
        sh "aws route53 change-resource-record-sets --hosted-zone-id \$(aws route53 list-hosted-zones-by-name --dns-name ${redirectDomain} --query 'HostedZones[0].Id' --output text) --change-batch file://aws-resources/${redirectDomain}.dns-record-set.json"
      }
    }
  } else {
    // Need to do something here for branches maybe. Deploy to a staging environment?
  }
}
