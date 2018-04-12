#include "Engine.h"
#include <map>
#include <cmath>
#include "Camera.h"
#include "Model.h"

namespace {
	std::map<int, bool> keyIsDown;
	std::map<int, bool> keyWasDown;
}

/*struct Vertex {
	glm::vec3 loc;
	glm::vec2 uv;
};*/


enum collider { sphere, aabb, none };

struct rigidBody {
	glm::vec3 velocity;
	glm::vec3 force;
	float mass;
};

struct transform {
	glm::vec3 loc;
	glm::vec3 rotation;
	glm::vec3 size;
	glm::mat4 objectWorldTransformation;
};

struct object {
	transform objectTransformation;
	std::string filePath;
	rigidBody objectBody;
	collider colliderType;
};

bool Engine::loadTextures() {
	//"textures/TestTexture.png"  File one
	//" " File Two
	FIBITMAP* image = nullptr;

	image = FreeImage_Load(FreeImage_GetFileType("textures/Background.jpg", 0), "textures/Background.jpg");
	if (image == nullptr)
	{
		std::cout << "error loading texture in Engine.cpp loadAndBindTexture(filePath)" << std::endl;
		return false; //error loading
	}
	FIBITMAP* image32bit = FreeImage_ConvertTo32Bits(image);
	glGenTextures(3, &textures[0]);
	glBindTexture(GL_TEXTURE_2D, textures[0]);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_SRGB_ALPHA, FreeImage_GetWidth(image32bit), FreeImage_GetHeight(image32bit), 0, GL_BGRA, GL_UNSIGNED_BYTE, (void*)FreeImage_GetBits(image32bit));
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);

	image = FreeImage_Load(FreeImage_GetFileType("textures/Tank.gif", 0), "textures/Tank.gif");
	if (image == nullptr)
	{
		std::cout << "error loading texture in Engine.cpp loadAndBindTexture(filePath)" << std::endl;
		return false; //error loading
	}
	glGenTextures(3, &textures[1]);
	glBindTexture(GL_TEXTURE_2D, textures[2]);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_SRGB_ALPHA, FreeImage_GetWidth(image32bit), FreeImage_GetHeight(image32bit), 0, GL_BGRA, GL_UNSIGNED_BYTE, (void*)FreeImage_GetBits(image32bit));
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);

	image = FreeImage_Load(FreeImage_GetFileType("textures/Alien.jpg", 0), "textures/Alien.jpg");
	if (image == nullptr)
	{
		std::cout << "error loading texture in Engine.cpp loadAndBindTexture(filePath)" << std::endl;
		return false; //error loading
	}
	FreeImage_Unload(image);
	glGenTextures(3, &textures[3]);
	glBindTexture(GL_TEXTURE_2D, textures[0]);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_SRGB_ALPHA, FreeImage_GetWidth(image32bit), FreeImage_GetHeight(image32bit), 0, GL_BGRA, GL_UNSIGNED_BYTE, (void*)FreeImage_GetBits(image32bit));
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	FreeImage_Unload(image32bit);

	return true; //file loaded
}

bool Engine::bindTexture(std::string filePath)
{
	FIBITMAP* image = nullptr;
	image = FreeImage_Load(FreeImage_GetFileType(filePath.c_str(), 0), filePath.c_str());

	FIBITMAP* image32bit = FreeImage_ConvertTo32Bits(image);
	glBindTexture(GL_TEXTURE_2D, textures[2]);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_SRGB_ALPHA, FreeImage_GetWidth(image32bit), FreeImage_GetHeight(image32bit), 0, GL_BGRA, GL_UNSIGNED_BYTE, (void*)FreeImage_GetBits(image32bit));
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	FreeImage_Unload(image32bit);
	FreeImage_Unload(image);
	return true;
}

/*
_________________________________________________________________________________________________
detects mouseClicks

where: windowPtr = pointer to current GLFW window
	   button = int value of button pressed (In this case left mouse int value should be passed in
_________________________________________________________________________________________________
*/
void mouseClick(GLFWwindow * windowPtr, int button, int action, int mods) {
	keyIsDown[button] = action;
}

/*
__________________________________________________________________________
listens for keyboard input and performs an action depending on key pressed

where: window = pointer to current GLFW window
	   key = key pressed
	   scancode = currently unused
	   action = what to do
__________________________________________________________________________
*/
void keyCallBack(GLFWwindow * window, int key, int scancode, int action, int mods) {
	keyIsDown[key] = action;
}

inline glm::mat4 GetMatrix(glm::vec3 pos, glm::vec3 rot, glm::vec3 sca)
{
	return glm::translate(pos) * glm::yawPitchRoll(rot.y, rot.x, rot.z) * glm::scale(sca);
}


void Engine::createGameObjects(glm::vec3 _loc, glm::vec3 _rotation, glm::vec3 _size, std::string _filepath, glm::vec3 _velocity, glm::vec3 _force, float _mass, collider _colliderType){
	object tempObject;
	transform tempTransform;
	rigidBody tempBody;

	std::string file = _filepath;

	tempTransform.loc = _loc;
	tempTransform.rotation = _rotation;
	tempTransform.size = _size;
	tempTransform.objectWorldTransformation = GetMatrix(tempTransform.loc, tempTransform.rotation, tempTransform.size);

	tempBody.velocity = _velocity;
	tempBody.force = _force;
	tempBody.mass = _mass;

	tempObject.objectTransformation = tempTransform;
	tempObject.filePath = file;
	tempObject.objectBody = tempBody;
	tempObject.colliderType = _colliderType;

	gameObjects.push_back(tempObject);
}

bool Engine::collidesWith(object* objectOne, object* objectTwo)
{
	if (objectOne->colliderType == none) {
		return false;
	}

	if (objectTwo->colliderType == none) {
		return false;
	}

	if (objectOne->colliderType == sphere)
	{
		//sphere and a sphere
		if (objectTwo->colliderType == sphere)
		{
			double xDistance = objectOne->objectTransformation.loc.x - objectTwo->objectTransformation.loc.x;
			double yDistance = objectOne->objectTransformation.loc.y - objectTwo->objectTransformation.loc.y;
			double zDistance = objectOne->objectTransformation.loc.z - objectTwo->objectTransformation.loc.z;
			double distance;

			distance = abs(xDistance) + abs(yDistance) + abs(zDistance);

			double radiiAdded = objectOne->objectTransformation.size.x + objectTwo->objectTransformation.size.x;

  			if (distance < radiiAdded)
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		if (objectTwo->colliderType == aabb)
		{
			double distance = sqrt(objectOne->objectTransformation.loc.x - objectTwo->objectTransformation.loc.x) + sqrt(objectOne->objectTransformation.loc.y - objectTwo->objectTransformation.loc.y) + sqrt(objectOne->objectTransformation.loc.z - objectTwo->objectTransformation.loc.z);
			double radius = sqrt(objectTwo->objectTransformation.size.x);

			if (distance < radius)
			{
				return false;
			}
			else
			{
				return true;
			}
		}
	}

	if (objectOne->colliderType == aabb)
	{
		if (objectTwo->colliderType == aabb)
		{
			float xSum = objectOne->objectTransformation.size.x + objectTwo->objectTransformation.size.x;
			float ySum = objectOne->objectTransformation.size.y + objectTwo->objectTransformation.size.y;
			float zSum = objectOne->objectTransformation.size.z + objectTwo->objectTransformation.size.z;

			if (fabs(objectOne->objectTransformation.loc.x - objectTwo->objectTransformation.loc.x) > xSum)
			{
				return false;
			}
			if (fabs(objectOne->objectTransformation.loc.y - objectTwo->objectTransformation.loc.y) > ySum)
			{
				return false;
			}
			if (fabs(objectOne->objectTransformation.loc.z - objectTwo->objectTransformation.loc.z) > zSum)
			{
				return false;
			}

			return true;
		}
		if (objectTwo->colliderType == sphere)
		{
			double distance = sqrt(objectOne->objectTransformation.loc.x - objectTwo->objectTransformation.loc.x) + sqrt(objectOne->objectTransformation.loc.y - objectTwo->objectTransformation.loc.y) + sqrt(objectOne->objectTransformation.loc.z - objectTwo->objectTransformation.loc.z);
			double radius = sqrt(objectOne->objectTransformation.size.x);

			if (distance < radius)
			{
				return false;
			}
			else
			{
				return true;
			}
		}
	}

}


Engine::Engine()
{
	
	loadTextures();
	std::string background = "textures/Background.jpg";
	std::string tank = "textures/Tank.gif";
	std::string alien = "textures/Alien.jpg";
	createGameObjects(glm::vec3(0, 0, 1), glm::vec3(0, 0, 0), glm::vec3(2,2,2), background, glm::vec3(0,0,0), glm::vec3(0,0,0), 1, sphere);
	createGameObjects(glm::vec3(0, -.75, 1), glm::vec3(0, 0, 0), glm::vec3(.15, .15, .15), tank, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(10, 10, 1), glm::vec3(0, 0, 0), glm::vec3(.01, .01, .01), tank, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(-.8, .50, 1), glm::vec3(0, 0, 0), glm::vec3(.05, .05, .05), alien, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(-.6, .50, 1), glm::vec3(0, 0, 0), glm::vec3(.05, .05, .05), alien, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(-.4, .50, 1), glm::vec3(0, 0, 0), glm::vec3(.05, .05, .05), alien, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(-.2, .50, 1), glm::vec3(0, 0, 0), glm::vec3(.05, .05, .05), alien, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(0, .50, 1), glm::vec3(0, 0, 0), glm::vec3(.05, .05, .05), alien, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(.2, .50, 1), glm::vec3(0, 0, 0), glm::vec3(.05, .05, .05), alien, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(.4, .50, 1), glm::vec3(0, 0, 0), glm::vec3(.05, .05, .05), alien, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
	createGameObjects(glm::vec3(.6, .50, 1), glm::vec3(0, 0, 0), glm::vec3(.05, .05, .05), alien, glm::vec3(0, 0, 0), glm::vec3(0, 0, 0), 1, sphere);
}

bool Engine::init()
{
	gameModel = Model();
	if (glfwInit() == GL_FALSE)
		return false;

	glfwWindowPtr = glfwCreateWindow(800, 600, "Logan Rogers DSA1 Engine",
		NULL, NULL);

	if (glfwWindowPtr != nullptr)
	{
		glfwMakeContextCurrent(glfwWindowPtr);
	}
	else
	{
		glfwTerminate();
		return false;
	}

	if (glewInit() != GLEW_OK)
	{
		glfwTerminate();
		return false;
	}

	//set click function on initilization
	glfwSetMouseButtonCallback(glfwWindowPtr, mouseClick);
	glfwSetKeyCallback(glfwWindowPtr, keyCallBack);

	return true;
}

bool Engine::bufferModels()
{
	if (gameModel.buffer("Models/sphere.obj"))
	{
		return true;

	}
	else
		return false;
}

bool Engine::gameLoop()
{


	//camera variables
	Camera gameCamera = Camera();
	float sens = .005;
	int w = 800, h = 600;
	double x, y;
	float pi = 3.14159f;
	bool cameraKeyWasPressed = false;
	//update variables
	bool isBulletActive = false;
	currentTime = glfwGetTime();
	previousTime = currentTime;
	double invaderCounter = 0;

	glfwSetInputMode(glfwWindowPtr, GLFW_CURSOR, GLFW_CURSOR_HIDDEN);
	gameCamera.cameraMat = gameCamera.perspectiveMat * gameCamera.lookAtMat;
	glClearColor(0.392f, 0.584f, 0.929f, 1.0f);

	while (!glfwWindowShouldClose(glfwWindowPtr))
	{
		previousTime = currentTime;
		currentTime = glfwGetTime();
		changeInTime = currentTime - previousTime;

		bool invaderPlus = true;
		keyWasDown = keyIsDown;  //store current keyDown too keyWasDown
		glfwPollEvents();  //Poll events, overwrites keyIsDown
		glClear(GL_COLOR_BUFFER_BIT);  //clear canvas  // do not repeat with each loop

		//=========================Update camera==================================================================
		glfwGetCursorPos(glfwWindowPtr, &x, &y);
		gameCamera.rotation.y -= sens* (x - w * .5f);
		gameCamera.rotation.x -= sens* (y - h * .5f);
		gameCamera.rotation.x = glm::clamp(gameCamera.rotation.x, -.5f * pi, .5f * pi);
		glfwSetCursorPos(glfwWindowPtr, w*.5f, h*.5f);

		glm::mat3 R = (glm::mat3)glm::yawPitchRoll(gameCamera.rotation.y, gameCamera.rotation.x, gameCamera.rotation.z);
		
		if (keyIsDown[GLFW_KEY_LEFT])
		{
			gameCamera.velocity += R * glm::vec3(-1, 0, 0);
			cameraKeyWasPressed = true;
		}
		if (keyIsDown[GLFW_KEY_RIGHT])
		{
			gameCamera.velocity += R * glm::vec3(1, 0, 0);
			cameraKeyWasPressed = true;
		}
		if (keyIsDown[GLFW_KEY_UP])
		{
			gameCamera.velocity += R * glm::vec3(0, 0, -1);
			cameraKeyWasPressed = true;
		}
		if (keyIsDown[GLFW_KEY_DOWN])
		{
			gameCamera.velocity += R * glm::vec3(0, 0, 1);
			cameraKeyWasPressed = true;
		}

		if (!cameraKeyWasPressed)
		{
			gameCamera.velocity = glm::vec3();
		}

		float speed = 1.f;
		if (gameCamera.velocity != glm::vec3())
		{
			gameCamera.velocity = glm::normalize(gameCamera.velocity) * speed;
		}

		gameCamera.loc += gameCamera.velocity * changeInTime;
		
		gameCamera.rotMat = (glm::mat3)glm::yawPitchRoll(gameCamera.rotation.y, gameCamera.rotation.x, gameCamera.rotation.z);
		gameCamera.eye = gameCamera.loc;
		gameCamera.center = gameCamera.eye + gameCamera.rotMat * glm::vec3(0, 0, -1);
		gameCamera.up = gameCamera.rotMat * glm::vec3(0, 1, 0);

		gameCamera.lookAtMat = glm::lookAt(gameCamera.eye, gameCamera.center, gameCamera.up);
		gameCamera.perspectiveMat = glm::perspective(gameCamera.fovy, gameCamera.aspect, gameCamera.zNear, gameCamera.zFar);
		gameCamera.cameraMat = gameCamera.perspectiveMat * gameCamera.lookAtMat;
		cameraKeyWasPressed = false;
		glUniformMatrix4fv(5, 1, GL_FALSE, &gameCamera.loc[0]);
		//=========================END UPDATE CAMERA==================================================================

		for (int i = 0; i < gameObjects.size(); i++)
		{
			// for gameObjects[i] send it's world transformation to shader
			gameModel.render();
			
			if(gameObjects[i].filePath == "textures/Background.jpg"){ bindTexture(gameObjects[i].filePath); }
			else if (gameObjects[i].filePath == "textures/Tank.gif") { bindTexture(gameObjects[i].filePath); }
			else if (gameObjects[i].filePath == "textures/Alien.jpg" && i == 3) { bindTexture(gameObjects[i].filePath ); }
			
			/*if (i != 0 && gameObjects[i-1].filePath != gameObjects[i].filePath) { loadAndBindTexture(gameObjects[i].filePath); }
			else if (i == 0) { loadAndBindTexture(gameObjects[i].filePath); }*/

			glUniformMatrix4fv(2, 1, GL_FALSE, &gameObjects[i].objectTransformation.objectWorldTransformation[0][0]);
			glUniformMatrix4fv(3, 1, GL_FALSE, &gameCamera.cameraMat[0][0]);
			
		}

		for (int i = 0; i < gameObjects.size(); i++) 
		{
			if (i > 2)
			{
				if (invaderCounter < 9.0)
				{
					gameObjects[i].objectBody.force = (glm::vec3(.20, 0, 0));
					
				}
				else if (invaderCounter == 9.5)
				{
					gameObjects[i].objectBody.force = (glm::vec3(0, -.20, 0));
				}
				else if (invaderCounter > 9.5 && invaderCounter < 19)
				{
					gameObjects[i].objectBody.force = (glm::vec3(-.20, 0, 0));
				}
				else if (invaderCounter == 19.5)
				{
					gameObjects[i].objectBody.force = (glm::vec3(0, -.20, 0));
				}
			}
		}

		if (invaderCounter >= 21) { invaderCounter = -.5;}
		invaderCounter += .5;
	

		glfwSwapBuffers(glfwWindowPtr);  //do not repeat with each loop

		//old mouseclick code
		if (keyIsDown[GLFW_KEY_ESCAPE]) {
			glfwSetWindowShouldClose(glfwWindowPtr, GL_TRUE);
		}

		if (keyIsDown[GLFW_KEY_A])
		{
			gameObjects[1].objectBody.force = (glm::vec3(-.32, 0, 0) * gameObjects[1].objectBody.mass);
		}

		if (keyIsDown[GLFW_KEY_D])
		{
			gameObjects[1].objectBody.force = glm::vec3(.32, 0, 0);
		}
		if (keyIsDown[GLFW_KEY_SPACE])
		{
			if (isBulletActive == false) {
				gameObjects[2].objectTransformation.loc = gameObjects[1].objectTransformation.loc;
				isBulletActive = true;
			}
		}

		for (int i = 0; i < gameObjects.size(); i++) {
			gameObjects[i].objectBody.velocity += gameObjects[i].objectBody.force;

			gameObjects[i].objectTransformation.loc += gameObjects[i].objectBody.velocity * gameObjects[1].objectBody.mass * changeInTime;
			gameObjects[i].objectTransformation.objectWorldTransformation = GetMatrix(gameObjects[i].objectTransformation.loc, gameObjects[i].objectTransformation.rotation, gameObjects[i].objectTransformation.size);
			gameObjects[i].objectBody.velocity = glm::vec3(0, 0, 0);
			gameObjects[i].objectBody.force = glm::vec3(0, 0, 0);
		}
		
		

		if (isBulletActive)
		{
			gameObjects[2].objectBody.force = glm::vec3(0, 1.5, 0);
			
			if (gameObjects[2].objectTransformation.loc.y > 1) { isBulletActive = false; }

			for (int i = 3; i < gameObjects.size(); i++)
			{
				object* tempOne = &gameObjects[2];
				object* tempTwo = &gameObjects[i];
				if (collidesWith(tempOne, tempTwo))
				{
					gameObjects[i].objectTransformation.loc.x = 100;
				}
			}
		}
	}
	
	glfwTerminate();

	return true;
}

bool Engine::useShaders(const char * file, const char * fragmentFile)
{
	if (shaderClass.loadShaders(file, fragmentFile)) {
		glUseProgram(shaderClass.getProgram());
		return true;
	}
	else
		return false;
}


Engine::~Engine()
{
}
