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
//https://www.opengl.org/sdk/docs/tutorials/ClockworkCoders/lighting.php
class Camera
{
public:
	glm::mat4 cameraMat;
	glm::vec3 velocity;
	glm::vec3 force;
	float mass;

	glm::vec3 loc = { 0, 0, 2 };
	glm::vec3 rotation{ 0, 0, 0 };
	glm::vec3 size; 
	glm::mat3 rotMat = (glm::mat3)glm::yawPitchRoll(rotation.y, rotation.x, rotation.z);
	glm::vec3 eye = loc;
	glm::vec3 center = eye + rotMat * glm::vec3(0, 0, -1);
	glm::vec3 up = rotMat * glm::vec3(0, 1, 0);
	glm::mat4 lookAtMat = glm::lookAt(eye, center, up);

	float zoom = 1.f;
	int width = 800;
	int height = 600;

	float fovy = 3.14159f *.4f / zoom;
	float aspect = (float)width / (float)height;
	float zNear = .01f;
	float zFar = 1000.f;
	glm::mat4 perspectiveMat = glm::perspective(fovy, aspect, zNear, zFar);
	Camera();

	~Camera();
};

