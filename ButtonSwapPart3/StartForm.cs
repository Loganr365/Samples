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
	public partial class StartForm : Form
	{
		public StartForm()
		{
			InitializeComponent();

			// After components are initialized, set up
			// the default label values
			labelWidthValue.Text = barWidth.Value.ToString();
			labelHeightValue.Text = barHeight.Value.ToString();
		}

		/// <summary>
		/// Updates the label of the width slider
		/// </summary>
		private void barWidth_Scroll(object sender, EventArgs e)
		{
			// Update the label with the bar's current value
			labelWidthValue.Text = barWidth.Value.ToString();
		}

		/// <summary>
		/// Updates the label of the height slider
		/// </summary>
		private void barHeight_Scroll(object sender, EventArgs e)
		{
			labelHeightValue.Text = barHeight.Value.ToString();
		}

		/// <summary>
		/// Starts the game by swapping to a different window
		/// </summary>
		private void buttonStart_Click(object sender, EventArgs e)
		{
			// Create the game form, passing in all
			// relevant game data
			GameForm game = new GameForm(
				barWidth.Value,
				barHeight.Value,
				this);

			// Hide and show as necessary
			this.Hide();
			game.ShowDialog();
		}
	}
}
