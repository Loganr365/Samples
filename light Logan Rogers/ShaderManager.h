#pragma once
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtx/transform.hpp>
#include <FreeImage.h>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

class ShaderManager
{
private:
	GLuint program; //Private index where loaded shaders are stored on the graphics card
public:
	ShaderManager(); //initializes program to 0

	GLuint getProgram() const; //Getter
	bool loadShaders(const char* file, const char* fragmentFile);
	GLuint loadShader(const char* file, GLenum shaderType);

	~ShaderManager();
};

