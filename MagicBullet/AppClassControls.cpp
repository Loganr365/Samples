#include "AppClass.h"

void AppClass::ProcessKeyboard(void)
{
	bool bModifier = false;
	float fSpeed = 0.01f;

#pragma region ON PRESS/RELEASE DEFINITION

	static bool	bLastF1 = false, bLastF2 = false, bLastF3 = false, bLastF4 = false, bLastF5 = false,
		bLastF6 = false, bLastF7 = false, bLastF8 = false, bLastF9 = false, bLastF10 = false,

		bLastEscape = false, bLastF = false;

#define ON_KEY_PRESS_RELEASE(key, pressed_action, released_action){  \
			bool pressed = sf::Keyboard::isKeyPressed(sf::Keyboard::key);			\
			if(pressed){											\
				if(!bLast##key) pressed_action;}/*Just pressed? */\
			else if(bLast##key) released_action;/*Just released?*/\
			bLast##key = pressed; } //remember the state
#pragma endregion



#pragma region Modifiers

	if (sf::Keyboard::isKeyPressed(sf::Keyboard::LShift) || sf::Keyboard::isKeyPressed(sf::Keyboard::RShift))
		bModifier = true;

#pragma endregion

#pragma region Camera Positioning

	//fire the bullet

	if (sf::Keyboard::isKeyPressed(sf::Keyboard::Space))
	{
		bullet.Reset(player.GetPosition() + vector3(0, 1, 0), player.GetEuler());
		bullet.SetFired(true);
		followBullet = true;
		globalTime = 0.02f;
	}
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::Tab))
	{
		ResetWorld();
	}

	//return to the fps player
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::BackSpace))
	{
		followBullet = false;
		globalTime = 1;
	}

	if (sf::Keyboard::isKeyPressed(sf::Keyboard::A))
	{
		if (followBullet)
		{
			bullet.ChangeRotSpeed(vector3(0, 0.25f, 0));
		}

		else
		{
			player.ChangeVelocity(vector3(-0.5f, 0, 0));
		}
	}
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::D))
	{
		if (followBullet)
		{
			bullet.ChangeRotSpeed(vector3(0, -0.25f, 0));
		}
		else
		{
			player.ChangeVelocity(vector3(0.5f, 0, 0));
		}
	}
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::W))
	{
		if (followBullet)
		{
			bullet.ChangeRotSpeed(vector3(-0.25f, 0, 0));
		}
		else
		{
			player.ChangeVelocity(vector3(0, 0, -0.5f));
		}
	}
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::S))
	{
		if (followBullet)
		{
			bullet.ChangeRotSpeed(vector3(0.25f, 0, 0));
		}
		else
		{
			player.ChangeVelocity(vector3(0, 0, 0.5f));
		}
	}

	ON_KEY_PRESS_RELEASE(Escape, NULL, PostMessage(m_pWindow->GetHandler(), WM_QUIT, NULL, NULL));

	/*	if(bModifier)

	fSpeed *= 10.0f;

	if(sf::Keyboard::isKeyPressed(sf::Keyboard::W))

	cam.MoveForward(fSpeed);



	if(sf::Keyboard::isKeyPressed(sf::Keyboard::S))

	cam.MoveForward(-fSpeed);



	if(sf::Keyboard::isKeyPressed(sf::Keyboard::A))

	cam.MoveSideways(-fSpeed);



	if(sf::Keyboard::isKeyPressed(sf::Keyboard::D))

	cam.MoveSideways(fSpeed);



	if (sf::Keyboard::isKeyPressed(sf::Keyboard::Q))

	cam.MoveVertical(-fSpeed);



	if (sf::Keyboard::isKeyPressed(sf::Keyboard::E))

	cam.MoveVertical(fSpeed);

	#pragma endregion*/



	/*

	#pragma region Other Actions

	ON_KEY_PRESS_RELEASE(Escape, NULL, PostMessage(m_pWindow->GetHandler(), WM_QUIT, NULL, NULL));

	ON_KEY_PRESS_RELEASE(F1, NULL, m_pCameraMngr->SetCameraMode(CAMPERSP));

	ON_KEY_PRESS_RELEASE(F2, NULL, m_pCameraMngr->SetCameraMode(CAMROTHOZ));

	ON_KEY_PRESS_RELEASE(F3, NULL, m_pCameraMngr->SetCameraMode(CAMROTHOY));

	ON_KEY_PRESS_RELEASE(F4, NULL, m_pCameraMngr->SetCameraMode(CAMROTHOX));

	static bool bFPSControll = false;

	ON_KEY_PRESS_RELEASE(F, bFPSControll = !bFPSControll, m_pCameraMngr->SetFPS(bFPSControll));

	#pragma endregion

	*/

}

void AppClass::ProcessMouse(void)

{

	m_bArcBall = false;

	m_bFPC = false;

#pragma region ON_MOUSE_PRESS_RELEASE

	static bool	bLastLeft = false, bLastMiddle = false, bLastRight = false;

#define ON_MOUSE_PRESS_RELEASE(key, pressed_action, released_action){  \
	bool pressed = sf::Mouse::isButtonPressed(sf::Mouse::Button::key);			\
		if (pressed) {				\
				if (!bLast##key) pressed_action;		\
		}/*Just pressed? */\
		else if (bLast##key) released_action;/*Just released?*/\
			bLast##key = pressed; } //remember the state
#pragma endregion
	if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Middle))

		m_bArcBall = true;



	//if(sf::Mouse::isButtonPressed(sf::Mouse::Button::Right))

	//m_bFPC = true;

	if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Right))

		//m_bFPC = false;

		m_bFPC = true;

}