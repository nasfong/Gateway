# Define variables
IMAGE_NAME = nasfong/gateway
TAG = latest
DOCKERFILE_PATH = .
DOCKERFILE_PROD = Dockerfile.production  # Specify the production Dockerfile

# Build the Docker image using the production Dockerfile
build:
	docker build -f $(DOCKERFILE_PROD) -t $(IMAGE_NAME):$(TAG) $(DOCKERFILE_PATH)

# Push the Docker image to Docker Hub
push:
	docker push $(IMAGE_NAME):$(TAG)

# Pull the Docker image from Docker Hub
pull:
	docker pull $(IMAGE_NAME):$(TAG)

# Build and push the Docker image in one step
build-and-push: build push

# Pull and run the Docker image
pull-and-run: pull
	docker run -p 5000:5000 --rm $(IMAGE_NAME):$(TAG)

# Clean up unused Docker images and containers
clean:
	docker system prune -f
