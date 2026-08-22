import javax.swing.*;
import java.awt.*;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Tik-Tak-Toe");
        frame.setLayout(new BorderLayout());
        TitelPanel titelPanel = new TitelPanel();
        frame.add(titelPanel, BorderLayout.NORTH);
        frame.add(new BoardPanel(titelPanel.getText1()), BorderLayout.CENTER);
        frame.pack();
        frame.getContentPane().setBackground(Color.BLACK);
        frame.setFocusable(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(600,500);
        frame.setResizable(false);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}