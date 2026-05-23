pipeline {
    agent any

    stages {
        stage('Pull') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    sh '''
                        cd /home/ubuntu/project/apps/ijip-naejip/ijip-naejip-front
                        git remote set-url origin https://${GIT_USER}:${GIT_TOKEN}@github.com/AppleTrick/ijip-naejip-front.git
                        git pull origin main
                        git remote set-url origin git@github.com:AppleTrick/ijip-naejip-front.git
                    '''
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'cd /home/ubuntu/project && docker compose up -d --build --no-deps ijip-front'
            }
        }
    }

    post {
        success {
            echo '이집내집 Frontend 배포 성공'
        }
        failure {
            echo '이집내집 Frontend 배포 실패'
        }
    }
}
