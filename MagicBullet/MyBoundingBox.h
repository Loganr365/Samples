#pragma once
#include "RE\ReEng.h"
class MyBoundingBoxClass
{
private:
	float m_fRadius = 0.0f; //radius of the sphere
	vector3 m_v3CenterLocal = vector3(0.0f); //center of the sphere in local space
	vector3 m_v3CenterGlobal = vector3(0.0f); //center of the sphere in global space
	vector3 m_v3Size = vector3(0.0f);
	vector3 m_v3Max = vector3(0.0f);
	vector3 m_v3Min = vector3(0.0f);
	vector3 m_v3MinGlobal = vector3(0.0f);
	vector3 m_v3MaxGlobal = vector3(0.0f);
	vector3 m_v3HalfWidthGlobal = vector3(0.0f);
	vector3 m_v3HalfWidthLocal = vector3(0.0f);
	vector3 reSize = vector3(0.0f);
	std::vector<vector4> reVertexList;
	matrix4 m_m4ToWorld = IDENTITY_M4; //matrix that takes you from local to global space
	matrix4 rotation = IDENTITY_M4;
	MeshManagerSingleton* m_pMeshMngr = nullptr; //for drawing the sphere
	bool m_bColliding = false;

public:
	/*
	Sets Colliding
	*/
	void SetColliding(bool input);
	/*
	Sets Center of the sphere in local space
	*/
	void SetCenterLocal(vector3 input);
	/*
	Sets Center of the sphere in global space
	*/
	void SetCenterGlobal(vector3 input);
	/*
	Sets the radius of the sphere
	*/
	void SetRadius(float input);

	/*
	Sets and stores the rotaion of the box
	*/
	void SetRotation(matrix4 rot);

	/*
	Gets Colliding
	*/
	bool GetColliding(void);
	/*
	Gets center of the sphere in local space
	*/
	vector3 GetCenterLocal(void);
	/*
	Gets center of the sphere in global space
	*/
	vector3 GetCenterGlobal(void);

	/*
	Gets model to world matrix of the sphere
	*/
	matrix4 GetModelMatrix(void);
	/*
	Gets radius of the sphere
	*/
	float GetRadius(void);
	
	/*
	Constructor, needs a vertex list
	*/
	MyBoundingBoxClass(std::vector<vector3> vertexList, float scale);
	/*
	Renders the sphere based on the radius and the center in global space
	*/
	void RenderSphere();
	/*
	Sets the transform from the local to world matrix
	*/
	void SetModelMatrix(matrix4 a_m4ToWorld);

	/*
	Will check the collision with another object
	*/
	bool IsColliding(MyBoundingBoxClass* a_other);

	bool SAT(MyBoundingBoxClass* a_other);
};