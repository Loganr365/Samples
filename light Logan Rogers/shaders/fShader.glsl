#version 430

precision mediump float;
in vec3 fragPosition;
in vec2 fragUV;
in vec3 fragNormal;
in vec3 lightLocation;
in vec3 cameraLocation;
uniform sampler2D myTexture;
vec3 L;
vec3 V;
vec3 H;
vec3 N;
vec4 ambient = vec4(.5, .5, .5, .5);
vec4 diffuse = vec4(.5, .5, .5, .5);
vec4 specular = vec4(.5, .5, .5, .5);

void main()
{
	N = fragNormal;
	L = normalize(lightLocation - fragPosition);
	V = normalize(cameraLocation - fragPosition);
	H = normalize(L - V);
	H = normalize(H * 1/2);

	ambient = vec4(0, 0, 0, 0);

	diffuse = diffuse * max(dot(N,L),0.0);
	diffuse = clamp(diffuse, 0.0, 1.0);

	specular = specular * max(dot(H, N),0.0);

	gl_FragColor = vec4(texture(myTexture, fragUV)) + ambient + diffuse + ambient;
}



