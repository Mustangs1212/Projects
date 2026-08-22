import javax.swing.*;
import java.awt.*;

public class TitelPanel extends JPanel {

    private static int count = 0;
    JLabel text1;
    TitelPanel() {
        this.setLayout(new BorderLayout());
        this.setBackground(Color.BLACK);

        text1 = new JLabel("Tik-Tak-Toe");
        text1.setBackground(Color.darkGray);
        text1.setForeground(Color.WHITE);
        text1.setFont(new Font("Arial", Font.BOLD, 30));
        text1.setOpaque(true);
        text1.setHorizontalAlignment(JLabel.CENTER);
        this.add(text1, BorderLayout.CENTER);

        JButton button1 = new JButton("Klick mich: 0");
        button1.setBackground(Color.DARK_GRAY);
        button1.setForeground(Color.WHITE);
        button1.addActionListener(e -> {
            count++;
            button1.setText("Klick mich: " + count);
        });
        this.add(button1, BorderLayout.EAST);

    }

    public JLabel getText1() {return  text1;}
}
