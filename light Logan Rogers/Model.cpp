#include "Model.h"
#include <fstream>
#include <iostream>
#include <string>
#include <sstream>
bool Model::buffer(std::string objFile)
{
	std::vector<glm::vec3> locs;
	std::vector<glm::vec2> uvs;
	std::vector<glm::vec3> normals;
	std::vector<VertInd> vertInds;

	std::ifstream inFile;
	inFile.open(objFile);
	
	//open object file
	if (inFile.is_open()) 
	{
		std::string line;  //string variable for each line

		//read object file line by line
		while (std::getline(inFile, line)) 
		{
			//create new stringstream for the line
			std::stringstream lineStream(line);

			//get the line's tag
			std::string tag;
			lineStream >> tag;

			//if the tag is a vertex add data to locations
			if (tag == "v") 
			{
				float x;
				float y;
				float z;
				lineStream >> x >> y >> z;
				locs.push_back(glm::vec3(x,y,z));
			}
			
			//process data bassed on tag
			//if tag is uv add data to uv vector(list)
			if (tag == "vt")
			{
				float u;
				float v;
				lineStream >> u >> v;
				uvs.push_back(glm::vec2(u, v));
			}

			//if tag is vn add data to normals
			if (tag == "vn")
			{
				float x;
				float y;
				float z;
				lineStream >> x >> y >> z;
				normals.push_back(glm::vec3(x, y, z));
			}

			//if tag is f add data to vertinds
			if (tag == "f")
			{	
				VertInd toPush;

				GLuint loc;
				GLuint uv;
				GLuint norm;
				char slash;

				for (int i = 0; i < 3; i++)
				{
					lineStream >> toPush.locInd >> slash >> toPush.uvInd >> slash >> toPush.normInd;
					toPush.locInd--;
					toPush.uvInd--;
					toPush.normInd--;
					vertInds.push_back(toPush);
				}
			}
		}
		inFile.close();
	}
	/*std::vector<glm::vec3> locs = {
		{ 1, 1, 0 },//0
		{ -1, 1, 0 }, //1
					  //{0.0, 0.0, 0.0}, //2
		{ -1, -1, 0 }, //2
		{ 1, -1, 0 } //3
	};

	std::vector<glm::vec2> uvs = {
		{ 1, 1 },
		{ 0, 1 },
		{ 0, 0 },
		{ 1, 0 }
	};

	std::vector <unsigned int> locInds =
	{ 0, 1, 2,
		0, 2, 3 };

	std::vector <unsigned int> uvInds =
	{ 0, 1, 2,
		0, 2, 3 };*/


	vertCount = vertInds.size();

	std::vector<Vertex> vertBufData(vertCount);
	
	for (unsigned int i = 0; i < vertCount; i++) 
	{
		vertBufData[i] = { locs[vertInds[i].locInd],
						   uvs[vertInds[i].uvInd],
						   normals[vertInds[i].normInd]};
	}

	glGenVertexArrays(1, &vertArr);
	glGenBuffers(1, &vertBuf);

	glBindVertexArray(vertArr);
	glBindBuffer(GL_ARRAY_BUFFER, vertBuf);

	glBufferData(GL_ARRAY_BUFFER, sizeof(Vertex) * vertCount, &vertBufData[0], GL_STATIC_DRAW);

	//Loc
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), 0);

	//UV
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)sizeof(glm::vec3));

	//Norm
	glEnableVertexAttribArray(4);
	glVertexAttribPointer(4, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)sizeof(glm::vec2));
	return true;
}

void Model::render()
{
	glBindVertexArray(vertArr);
	glDrawArrays(GL_TRIANGLES, 0, vertCount);
}

Model::Model()
{
}


Model::~Model()
{
}
