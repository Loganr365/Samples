#version 430

precision mediump float;
in vec2 fragUV;

void main()
{
	gl_FragColor = vec4(fragUV.x,fragUV.y,.25,1);
}