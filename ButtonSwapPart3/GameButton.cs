using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Windows.Forms;
using System.Drawing;

namespace ButtonSwapPart1
{
	class GameButton : Button
	{
		// Fields
		private Color color;
		private int xIndex;
		private int yIndex;

		// Animation-related fields
		public bool moving;
		private int targetPosX;
		private int targetPosY;

		/// <summary>
		/// Gets or sets the x index of this button
		/// </summary>
		public int XIndex
		{
			get { return xIndex; }
			set { xIndex = value; }
		}

		/// <summary>
		/// Gets or sets the y index of this button
		/// </summary>
		public int YIndex
		{
			get { return yIndex; }
			set { yIndex = value; }
		}

		/// <summary>
		/// Creates a single game button that can be
		/// selected and swapped
		/// </summary>
		/// <param name="color">The color of the button</param>
		/// <param name="xIndex">The x index of the button on a form</param>
		/// <param name="yIndex">The y index of the button on a form</param>
		public GameButton(Color color, int xIndex, int yIndex)
		{
			// Save the parameters
			this.xIndex = xIndex;
			this.yIndex = yIndex;
			this.color = color;

			// Set up the button itself
			this.BackColor = color;
			this.Location = new Point(
				xIndex * GameManager.ButtonSize,
				yIndex * GameManager.ButtonSize);
			this.Size = new Size(
				GameManager.ButtonSize,
				GameManager.ButtonSize);

			// Makes the button look more "flat"
			Deselect();

			// Hook up the click event
			this.Click += Clicked;
		}

		// Two helper methods for selecting/de-selecting

		/// <summary>
		/// Changes the visual representation of the button
		/// so that it looks "selected"
		/// </summary>
		public void Select()
		{
			this.FlatStyle = FlatStyle.Standard;
		}

		/// <summary>
		/// Changes the visuals so it looks "regular"
		/// </summary>
		public void Deselect()
		{
			this.FlatStyle = FlatStyle.Popup;
		}

		/// <summary>
		/// Event handler for when this button is clicked
		/// and becomes selected
		/// </summary>
		private void Clicked(object sender, EventArgs e)
		{
			Select();
		}

		// ------------------------------------
		// Animation-related methods
		// ------------------------------------

		/// <summary>
		/// Instructs the button to begin moving
		/// to the specified coordinates
		/// </summary>
		/// <param name="x">The target's x position</param>
		/// <param name="y">The target's y position</param>
		public void MoveTo(int x, int y)
		{
			targetPosX = x;
			targetPosY = y;
			moving = true;
		}

		/// <summary>
		/// Instructs the button to begin moving
		/// to the specified coordinates
		/// </summary>
		/// <param name="target">The target position</param>
		public void MoveTo(Point target)
		{
			this.MoveTo(target.X, target.Y);
		}

		/// <summary>
		/// Updates any pending animations (movement)
		/// of this button towards its target
		/// </summary>
		public bool UpdateAnimation()
		{
			// Are we moving at all?
			if (!moving)
			{
				return false;
			}

			// Get the overall difference between the current
			// and target locations
			int xDiff = targetPosX - this.Location.X;
			int yDiff = targetPosY - this.Location.Y;

			// How many pixels to actually move
			// during this frame
			int xMove = Math.Sign(xDiff) * GameManager.AnimationSpeed;
			int yMove = Math.Sign(yDiff) * GameManager.AnimationSpeed;

			if (Math.Abs(xDiff) < Math.Abs(xMove)) xMove = xDiff;
			if (Math.Abs(yDiff) < Math.Abs(yMove)) yMove = yDiff;

			// Actually move this button!
			Point loc = this.Location;
			loc.X += xMove;
			loc.Y += yMove;
			this.Location = loc;

			// Did we hit our target?
			if (this.Location.X == targetPosX &&
				this.Location.Y == targetPosY)
			{
				// We have landed on the target!
                moving = true;
                return moving;
			}

            return false;
		}
	}
}
