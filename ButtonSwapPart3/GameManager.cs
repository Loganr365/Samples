using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Windows.Forms;
using System.Drawing;

namespace ButtonSwapPart1
{
	class GameManager
	{
		/// <summary>
		/// Defines the possible directions
		/// we might care about later in the code
		/// </summary>
		public enum Direction
		{
			Up,
			Down,
			Left,
			Right
		}

		// Constants
		public const int ButtonSize = 50;
		public const int MinimumToWin = 3;
		public const int AnimationSpeed = 3;

		// Fields
        private int score = 0;
        private int upLength = 0;
        private int downLength = 0;
        private int leftLength = 0;
        private int rightLength = 0;
		private GameForm gameForm;
		private Size gameSize;
		private Random random;

		private GameButton[,] buttonGrid;
		private GameButton selected;

		// Potential colors for the game
		private Color[] colors =
		{
			Color.Red,
			Color.Green,
			Color.Blue,
			Color.Orange,
			Color.Yellow
		};


		/// <summary>
		/// Creates a manager for handling all of
		/// the game logic
		/// </summary>
		/// <param name="width">Number of buttons on the x axis</param>
		/// <param name="height">Number of buttons on the y axis</param>
		/// <param name="gameForm">The game form itself</param>
		public GameManager(int width, int height, GameForm gameForm)
		{
			// Save the parameters
			this.gameSize = new Size(width, height);
			this.gameForm = gameForm;

			// Set up fields
			random = new Random();
			buttonGrid = new GameButton[width, height];
			selected = null;
			gameForm.ClientSize = new Size(
				width * ButtonSize,
				height * ButtonSize);

			// Create the buttons
			for(int y = 0; y < height; y++)
			{
				for (int x = 0; x < width; x++)
				{
					// Create a single button
					GameButton gb = new GameButton(
						colors[random.Next(colors.Length)], // Get a random color out of the color array
						x,
						y);

					// Add the button to the game form itself
					this.gameForm.Controls.Add(gb);

					// Add to the array (grid) itself too
					buttonGrid[x, y] = gb;

					// Hook up the button's click event so
					// that the manager knows about it too!
					gb.Click += ButtonClicked;

					// Make sure the color doesn't trigger
					// a win state
					while (IsPartOfGroup(gb))
					{
						gb.BackColor = colors[random.Next(colors.Length)];
					}
				}
			}
		}

		/// <summary>
		/// This is called whenever a button in the grid
		/// is clicked - it should take care of the "selection"
		/// logic and eventually more
		/// </summary>
		private void ButtonClicked(object sender, EventArgs e)
		{
			// Ensure a button was actually clicked
			GameButton button = sender as GameButton;
			if (button == null)
			{
				return; // Nothing to do, get out!
			}

			// Is nothing selected?
			if (selected == null)
			{
				selected = button;
			}
			else if(button == selected)
			{
				// The clicked button was also
				// the currently selected button

				selected.Deselect();
				selected = null;
			}
			else // There WAS a selected button!
			{
				// Update the visuals
				selected.Deselect();

				// Determine if the two buttons
				// are "neighbors"
				int xDiff = Math.Abs(selected.XIndex - button.XIndex);
				int yDiff = Math.Abs(selected.YIndex - button.YIndex);

				// Are the two buttons next to each other?
				if( (xDiff == 1 && yDiff == 0) ||
					(xDiff == 0 && yDiff == 1))
				{
					selected.MoveTo(button.Location);
					button.MoveTo(selected.Location);

					// Make sure to update the indices
					SwapIndices(button, selected);
				}

   
				// Deselect everything!
				selected.Deselect();
				button.Deselect();
				selected = null;
			}

            
		}

		/// <summary>
		/// Swaps the indices of two buttons, in both
		/// the grid (the 2d array) and inside the
		/// buttons themselves
		/// </summary>
		/// <param name="b1">The first button</param>
		/// <param name="b2">The other button</param>
		private void SwapIndices(GameButton b1, GameButton b2)
		{
			// Update the grid/array first
			buttonGrid[b1.XIndex, b1.YIndex] = b2;
			buttonGrid[b2.XIndex, b2.YIndex] = b1;

			// Swap the internal indices of the buttons
			int b1X = b1.XIndex;
			int b1Y = b1.YIndex;
			
			// Overwrite b1
			b1.XIndex = b2.XIndex;
			b1.YIndex = b2.YIndex;

			// Overwrite b2
			b2.XIndex = b1X;
			b2.YIndex = b1Y;
		}

		/// <summary>
		/// Will be called by the GameForm's timer.
		/// Should update all button animations as necessary.
		/// </summary>
		public void UpdateAnimations(object sender, EventArgs e)
		{
			// Call the update method on each
			// button in the grid!
			foreach (GameButton gb in buttonGrid)
			{
		        if (gb.UpdateAnimation() == false)
                {
                    UpdateGroups(gb);
                }
                
                
			}
		}

		/// <summary>
		/// Gets a neighboring game button based on
		/// a direction and an offset value
		/// </summary>
		/// <param name="gb">The origina button</param>
		/// <param name="dir">Which direction to look</param>
		/// <param name="offset">How many spots away is the button to get?</param>
		/// <returns>A game button, or null if invalid indices are found</returns>
		private GameButton GetNeighbor(GameButton gb, Direction dir, int offset)
		{
			// Calculate the indices of the neighbor button
			int x = gb.XIndex;
			int y = gb.YIndex;

			// Check the four possible directions
			switch (dir)
			{
				case Direction.Up: y -= offset; break;
				case Direction.Down: y += offset; break;
				case Direction.Left: x -= offset; break;
				case Direction.Right: x += offset; break;
			}

			// Are my new indices actually valid?
			if (x < 0 || y < 0 ||
				x >= gameSize.Width ||
				y >= gameSize.Height)
			{
				// We're off the grid!  Problem
				return null;
			}

			// Return the piece from the grid
			// at that position
			return buttonGrid[x, y];
		}

		/// <summary>
		/// Gets the length of a group of similar colors
		/// in a particular direction
		/// starting at the specified game button
		/// </summary>
		/// <param name="gb">Which button to check</param>
		/// <param name="dir">Which direction to look</param>
		/// <returns>At least 1, potentially more</returns>
		private int GetGroupLength(GameButton gb, Direction dir)
		{
			// Starting values
			int groupCount = 0;
			GameButton currentButton = null;

			do
			{
				// Alter the current group count
				groupCount++;

				// Get the neighbor in the specified direction
				currentButton = 
					GetNeighbor(gb, dir, groupCount);

			} while(currentButton != null && currentButton.BackColor == gb.BackColor);

			// Return the final group count
			return groupCount;
		}


		/// <summary>
		/// Determines if the specified button is part
		/// of a valid (winning) group
		/// </summary>
		/// <param name="gb">The button to check</param>
		/// <returns>True if in a valid group, false otherwise</returns>
		private bool IsPartOfGroup(GameButton gb)
		{
			// Check the length in all directions
            upLength = GetGroupLength(gb, Direction.Up);
            downLength = GetGroupLength(gb, Direction.Down);
            leftLength = GetGroupLength(gb, Direction.Left);
            rightLength = GetGroupLength(gb, Direction.Right);

			// Calculate each axis
            int vertical = upLength + downLength - 1;
            int horiz = leftLength + rightLength - 1;

			// Did we find a valid group?
			return vertical >= MinimumToWin ||
				   horiz >= MinimumToWin;
		}

        public void UpdateGroups(GameButton gb)
        {
            bool isAGroup;
            int x = gb.XIndex;
            int y = gb.YIndex;


            isAGroup = IsPartOfGroup(gb);

            if (isAGroup == true)
            {
                gb.BackColor = Color.Black;
                gb.Enabled = false;


                for (int i = 0; i < upLength; i ++)
                {
                    buttonGrid[x, (y - i)].BackColor = Color.Black;
                    buttonGrid[x, (y - i)].Enabled = false;
                }

                for (int i = 0; i < downLength; i++)
                {
                    buttonGrid[x, (y + i)].BackColor = Color.Black;
                    buttonGrid[x, (y + i)].Enabled = false;
                }

                for (int i = 0; i < leftLength; i++)
                {
                    buttonGrid[(x - i), y].BackColor = Color.Black;
                    buttonGrid[(x - i), y].Enabled = false;
                }

                for (int i = 0; i < rightLength; i++)
                {
                    buttonGrid[(x + i), y].BackColor = Color.Black;
                    buttonGrid[(x + i), y].Enabled = false;
                }

                score = score + (upLength + downLength + leftLength + rightLength - 2);
            }

        }
	}
}
