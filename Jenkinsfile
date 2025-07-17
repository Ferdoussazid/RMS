pipeline {
	agent { label 'master'}
	environment {
		AWS_ACCOUNT_ID = "945726102065"
        AWS_REGION = "ap-southeast-1"
		IMAGE_REPO_NAME = "test-rms-ui"
    BUILD_TAG = "2.65"
    }
    stages {
        stage('Data Sync') {
            	steps {
                	sh 'pwd'
                	sh 'hostname'
                	sh 'ssh -o StrictHostKeyChecking=no -i /test/Test_Server_Keypair_9th_June24.pem ubuntu@18.141.98.213 "cd /home/ubuntu/rms-ui && rm -r api assets components layouts middleware mixins pages plugins static store"'
                	sh 'rsync -a -e "ssh -o StrictHostKeyChecking=no -i /test/Test_Server_Keypair_9th_June24.pem" api assets components layouts middleware mixins pages plugins static store ubuntu@18.141.98.213:/home/ubuntu/rms-ui'
                	sh 'rsync -a -e "ssh -o StrictHostKeyChecking=no -i /test/Test_Server_Keypair_9th_June24.pem" package.json package-lock.json nuxt.config.js tailwind.config.js ubuntu@18.141.98.213:/home/ubuntu/rms-ui'

            	}
        }
		  stage('Build Image & Push to Repo') {
			agent { label 'slave-test' }
			options { skipDefaultCheckout() }
			steps {
                sh 'pwd'
				sh "cd /home/ubuntu/rms-ui && sudo docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${BUILD_TAG} ."
				sh "sudo aws ecr get-login-password --region ${AWS_REGION} | sudo docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
				sh "sudo docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${BUILD_TAG}"
			}
		}
        stage('Container Deployment') {
            agent { label 'slave-test'}
            options { skipDefaultCheckout() }
            steps {
                sh 'pwd'
                sh 'hostname'
                sh "cd /home/ubuntu/rms-ui && sed -i 's/image.*/image: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com\\/${IMAGE_REPO_NAME}:${BUILD_TAG}/' docker-compose.yml"
                sh 'cd /home/ubuntu/rms-ui && sudo docker-compose up -d --remove-orphans'

            }
        }
        stage('Container Log Analysis') {
            agent { label 'slave-test'}
            options { skipDefaultCheckout() }
            steps {
                sh 'pwd'
                sh 'hostname'
                sh 'cd /home/ubuntu/rms-ui && sudo docker-compose logs --tail=100'
                echo 'Deployment Successful...!'

            }
        }

    }
}
