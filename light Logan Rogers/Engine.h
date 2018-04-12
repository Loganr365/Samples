#pragma once
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtx/transform.hpp>
#include <FreeImage.h>
#include <string>
#include <vector>
#include "ShaderManager.h"
#include <string>
#include <iostream>
#include <glm/gtx/transform.hpp>
#include <glm/gtx/euler_angles.hpp>
#include "Model.h"

class Engine
{
private:
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

	enum collider { sphere, aabb, none };
	
	struct object { 
	transform objectTransformation;
	std::string filePath;
	rigidBody objectBody;
	collider colliderType;
	};

	struct Vertex {
		glm::vec3 loc;
		glm::vec2 uv;
	};

	struct ModelVertex {
		glm::vec3 loc;
		glm::vec2 uv;
		glm::vec3 normal;
	};

	struct VertInd {
		GLuint locInd;
		GLuint uvInd;
		GLuint normInd;
	};

	GLuint* textures = new GLuint[3];
	GLFWwindow* glfwWindowPtr;
	unsigned int vertCount;
	ShaderManager shaderClass = ShaderManager();
	std::vector<object> gameObjects;
	float currentTime;
	float previousTime;
	float changeInTime;
	void createGameObjects(glm::vec3, glm::vec3, glm::vec3, std::string, glm::vec3, glm::vec3, float, collider);
	
public:
	Engine();
	Model gameModel;
	bool init();
	bool bufferModels();
	bool gameLoop();
	bool collidesWith(object*, object*);
	bool useShaders(const char* file, const char* fragmentFile);
	bool loadTextures();
	bool bindTexture(std::string);
	~Engine();
};
