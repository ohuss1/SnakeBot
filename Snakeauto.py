import pyautogui
import time
time.sleep(3.0);
x,y=pyautogui.position();
pyautogui.click(x,y);
time.sleep(0.5);
pyautogui.keyDown('right')
time.sleep(0.5);
pyautogui.keyUp('right')
