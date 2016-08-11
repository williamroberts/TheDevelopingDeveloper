node('master') {
  def safeBranchName = env.BRANCH_NAME.replace("origin/", "").replace("/", "_")

  stage 'Checkout'
  checkout scm

  stage 'Docker Build'
  def img = docker.build "thedevelopingdeveloper:${safeBranchName}"

  stage 'Snarfle dist folder'
  def tempContainerName = "snarfle"
  img.withRun('--name="snarfle"') { container ->
     sh "docker cp ${tempContainerName}:/home/app/dist /tmp"
  }

  stage 'Deploy to S3 bucket'
  
}
