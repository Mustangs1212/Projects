import javax.swing.*;
import java.awt.*;

public class TopPanel extends  JPanel{

    JLabel topText = new JLabel("Sudoku: 0");
    public TopPanel() {
        topText.setHorizontalAlignment(JLabel.CENTER);
        topText.setFont(new Font("Arial",Font.BOLD,30));
        topText.setForeground(Color.WHITE);
        this.setBackground(Color.DARK_GRAY);
        this.setSize(600,650);
        this.add(topText);
    }

    public JLabel getTopText() {
        return topText;
    }
}
