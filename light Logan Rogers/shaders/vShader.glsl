#version 430

layout (location = 0) in vec3 position;
layout (location = 1) in vec2 uv;
layout (location = 2) uniform mat4 transformation;
layout (location = 3) uniform mat4 cameraMatrix;
layout (location = 4) in vec3 normal;
layout (location = 5) in vec3 camLoc;
out vec3 fragPosition;
out vec2 fragUV;
out vec3 fragNormal;
out vec3 lightLocation;
out vec3 cameraLocation;

void main()
{
	fragNormal = normal;
	lightLocation = camLoc;
	cameraLocation = camLoc;
	fragPosition = position;
	fragUV = uv;
	gl_Position = cameraMatrix * transformation * vec4(position, 1);
}