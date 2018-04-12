#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtx/transform.hpp>
#include <FreeImage.h>
#include <vector>
#include "Engine.h"
int main() {
	Engine engineTester = Engine();


	if (engineTester.init() == false)
		return -1;

	if (engineTester.bufferModels() == false)
		return -1;

	if (engineTester.useShaders("shaders/vShader.glsl", "shaders/fShader.glsl") == true)
	{
		if (engineTester.gameLoop() == false)
			return -1;
	}
	else
		return -1;

	return 0;
}