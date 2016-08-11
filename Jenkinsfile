node('master') {
  def safeBranchName = env.BRANCH_NAME.replace("origin/", "").replace("/", "_")

  stage 'Checkout'
  checkout scm

  stage 'Docker Build'
  def img = docker.build "thedevelopingdeveloper:${safeBranchName}"
}
