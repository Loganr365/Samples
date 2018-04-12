#include "ShaderManager.h"



ShaderManager::ShaderManager()
{
}

GLuint ShaderManager::getProgram() const
{
	return program;
}

bool ShaderManager::loadShaders(const char * file, const char * fragmentFile)
{

	GLuint vertexShader = 
	loadShader(file, GL_VERTEX_SHADER);

	if (vertexShader == 0)
		return false;

	GLuint fragmentShader =
	loadShader(fragmentFile, GL_FRAGMENT_SHADER);

	if (fragmentShader == 0)
	return false;

	program =
		glCreateProgram();

	glAttachShader(program, vertexShader);
	glAttachShader(program, fragmentShader);

	glLinkProgram(program);

	GLint isLinked = 0;
	glGetProgramiv(program, GL_LINK_STATUS, (int *)&isLinked);
	
	if (isLinked == GL_FALSE)
	{
		GLint logLength = 0;
		glGetProgramiv(program, GL_INFO_LOG_LENGTH, &logLength);

		std::vector<GLchar> infoLog(logLength);
		glGetProgramInfoLog(program, logLength, &logLength, &infoLog[0]);

		glDeleteProgram(program);

		std::cout << "Error Linking Shader" << std::endl;
		for each (GLchar toPrint in infoLog) {
			std::cout << " " << toPrint;
		}
		std::cout << std::endl;
		return false;
	}

	return true;
}

GLuint ShaderManager::loadShader(const char * file, GLenum shaderType)
{
	GLuint shaderIndex = 0;

	std::ifstream inFileBinary(file, std::ios::binary);
	if (inFileBinary.is_open()) 
	{

		//figure out length of file
		inFileBinary.seekg(0, std::ios::end);
		unsigned int length = (unsigned int)inFileBinary.tellg();

		//save that many chars on the heap
		char* fileContents = new char[length + 1];

		inFileBinary.seekg(0, std::ios::beg);
		//read file into char array
		inFileBinary.read(fileContents, length);
		fileContents[length] = '\0';

		std::string content(fileContents);

		shaderIndex = glCreateShader(shaderType);

		const GLchar *source = (const GLchar *)content.c_str();

		glShaderSource(shaderIndex, 1, &source, 0);

		glCompileShader(shaderIndex);


		//delete fileContents;
									//these are commented out because they cause the program to crash, I am unsure of why that is.  Results in a memory leak.
		//delete source;
	}
	else
	{
		std::cout << "error opening file in ShaderManager loadShader(" << file << ", " << shaderType << "(" << std::endl;
		return 0;
	}

	GLint didComplie = 0;
	glGetShaderiv(shaderIndex, GL_COMPILE_STATUS, &didComplie);

	if (didComplie != GL_FALSE)
	{
		return shaderIndex;
	}
	else
	{
		GLint logLength = 0;

		glGetShaderiv(shaderIndex, GL_INFO_LOG_LENGTH, &logLength);

		std::vector<GLchar> errorLog(logLength);

		glGetShaderInfoLog(shaderIndex, logLength, &logLength, &errorLog[0]);

		std::cout << "Error compiling Shader" << std::endl;
		for each (GLchar toPrint in errorLog) {
			std::cout << " " << toPrint;
		}
		std::cout << std::endl;

	}
}


ShaderManager::~ShaderManager()
{
}
