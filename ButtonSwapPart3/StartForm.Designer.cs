namespace ButtonSwapPart1
{
	partial class StartForm
	{
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.barWidth = new System.Windows.Forms.TrackBar();
			this.barHeight = new System.Windows.Forms.TrackBar();
			this.labelWidth = new System.Windows.Forms.Label();
			this.labelHeight = new System.Windows.Forms.Label();
			this.labelWidthValue = new System.Windows.Forms.Label();
			this.labelHeightValue = new System.Windows.Forms.Label();
			this.buttonStart = new System.Windows.Forms.Button();
			((System.ComponentModel.ISupportInitialize)(this.barWidth)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.barHeight)).BeginInit();
			this.SuspendLayout();
			// 
			// barWidth
			// 
			this.barWidth.Location = new System.Drawing.Point(100, 27);
			this.barWidth.Minimum = 3;
			this.barWidth.Name = "barWidth";
			this.barWidth.Size = new System.Drawing.Size(104, 45);
			this.barWidth.TabIndex = 0;
			this.barWidth.Value = 5;
			this.barWidth.Scroll += new System.EventHandler(this.barWidth_Scroll);
			// 
			// barHeight
			// 
			this.barHeight.Location = new System.Drawing.Point(100, 78);
			this.barHeight.Minimum = 3;
			this.barHeight.Name = "barHeight";
			this.barHeight.Size = new System.Drawing.Size(104, 45);
			this.barHeight.TabIndex = 1;
			this.barHeight.Value = 5;
			this.barHeight.Scroll += new System.EventHandler(this.barHeight_Scroll);
			// 
			// labelWidth
			// 
			this.labelWidth.AutoSize = true;
			this.labelWidth.Location = new System.Drawing.Point(25, 33);
			this.labelWidth.Name = "labelWidth";
			this.labelWidth.Size = new System.Drawing.Size(69, 13);
			this.labelWidth.TabIndex = 2;
			this.labelWidth.Text = "Game Width:";
			// 
			// labelHeight
			// 
			this.labelHeight.AutoSize = true;
			this.labelHeight.Location = new System.Drawing.Point(25, 87);
			this.labelHeight.Name = "labelHeight";
			this.labelHeight.Size = new System.Drawing.Size(72, 13);
			this.labelHeight.TabIndex = 3;
			this.labelHeight.Text = "Game Height:";
			// 
			// labelWidthValue
			// 
			this.labelWidthValue.AutoSize = true;
			this.labelWidthValue.Location = new System.Drawing.Point(210, 33);
			this.labelWidthValue.Name = "labelWidthValue";
			this.labelWidthValue.Size = new System.Drawing.Size(16, 13);
			this.labelWidthValue.TabIndex = 4;
			this.labelWidthValue.Text = "-1";
			// 
			// labelHeightValue
			// 
			this.labelHeightValue.AutoSize = true;
			this.labelHeightValue.Location = new System.Drawing.Point(210, 87);
			this.labelHeightValue.Name = "labelHeightValue";
			this.labelHeightValue.Size = new System.Drawing.Size(16, 13);
			this.labelHeightValue.TabIndex = 5;
			this.labelHeightValue.Text = "-1";
			// 
			// buttonStart
			// 
			this.buttonStart.Location = new System.Drawing.Point(74, 146);
			this.buttonStart.Name = "buttonStart";
			this.buttonStart.Size = new System.Drawing.Size(116, 50);
			this.buttonStart.TabIndex = 6;
			this.buttonStart.Text = "Start Game";
			this.buttonStart.UseVisualStyleBackColor = true;
			this.buttonStart.Click += new System.EventHandler(this.buttonStart_Click);
			// 
			// StartForm
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(253, 231);
			this.Controls.Add(this.buttonStart);
			this.Controls.Add(this.labelHeightValue);
			this.Controls.Add(this.labelWidthValue);
			this.Controls.Add(this.labelHeight);
			this.Controls.Add(this.labelWidth);
			this.Controls.Add(this.barHeight);
			this.Controls.Add(this.barWidth);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
			this.MaximizeBox = false;
			this.MinimizeBox = false;
			this.Name = "StartForm";
			this.Text = "Button Swap";
			((System.ComponentModel.ISupportInitialize)(this.barWidth)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.barHeight)).EndInit();
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.TrackBar barWidth;
		private System.Windows.Forms.TrackBar barHeight;
		private System.Windows.Forms.Label labelWidth;
		private System.Windows.Forms.Label labelHeight;
		private System.Windows.Forms.Label labelWidthValue;
		private System.Windows.Forms.Label labelHeightValue;
		private System.Windows.Forms.Button buttonStart;
	}
}

