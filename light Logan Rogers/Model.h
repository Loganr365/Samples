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
#include <vector>
#include <glm/gtx/transform.hpp>
#include <glm/gtx/euler_angles.hpp>

struct Vertex {
	glm::vec3 loc;
	glm::vec2 uv;
	glm::vec3 normal;
};

struct VertInd {
	GLuint locInd;
	GLuint uvInd;
	GLuint normInd;
};

class Model
{
private:
	GLuint vertArr;
	GLuint vertBuf;
	unsigned int vertCount;

public:
	bool buffer(std::string objFile);
	void render();
	Model();
	~Model();
};

