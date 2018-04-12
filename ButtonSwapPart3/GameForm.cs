using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ButtonSwapPart1
{
	public partial class GameForm : Form
	{
		// Fields
		private Form startForm;
		private GameManager gameManager;

		/// <summary>
		/// Creates a new form on which the game is played
		/// </summary>
		/// <param name="gameWidth">Number of buttons on the X axis</param>
		/// <param name="gameHeight">Number of buttons on the Y axis</param>
		/// <param name="startForm">The original form with "options"</param>
		public GameForm(int gameWidth, int gameHeight, StartForm startForm)
		{
			// Save the start form
			this.startForm = startForm;

			// Components are set up
			InitializeComponent();

			// Create the game manager
			this.gameManager = new GameManager(
				gameWidth,
				gameHeight,
				this);

			// Hook up the game manager's update function
			// to the timer's tick event
			animationTimer.Tick += gameManager.UpdateAnimations;
			animationTimer.Start();
		}

		/// <summary>
		/// When closing, re-show the start form
		/// </summary>
		private void GameForm_FormClosing(object sender, FormClosingEventArgs e)
		{
			startForm.Show();
		}
	}
}
