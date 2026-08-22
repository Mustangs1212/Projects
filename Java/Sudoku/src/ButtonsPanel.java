import javax.swing.*;
import java.awt.*;

public class ButtonsPanel extends JPanel {

    private JButton numSelected = null;

    public ButtonsPanel() {
        this.setLayout(new GridLayout(1,9));
        setupButtons();
        this.setBackground(Color.GRAY);
        this.setFocusable(false);
    }

    private void setupButtons() {
        for (int i = 0; i < 10; i++) {
            JButton button = new JButton();
            button.setText(String.valueOf(i));
            button.setFocusable(false);
            button.setBackground(Color.GRAY);
            button.setFont(new Font("Arial",Font.BOLD,20));
            this.add(button);

            button.addActionListener(e -> {
                JButton button1 = (JButton) e.getSource();
                if (numSelected != null) {
                    numSelected.setBackground(Color.GRAY);
                }
                numSelected = button1;
                numSelected.setBackground(Color.LIGHT_GRAY);
            });
        }
    }

    public JButton getNumSelected() {
        return numSelected;
    }
}
