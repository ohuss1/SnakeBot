import pyautogui
import time
import threading

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t
int posX=130;
int PosY=5;

time.sleep(3.0);
x,y=pyautogui.position();
pyautogui.click(x,y);
time.sleep(0.5);
pyautogui.keyDown('right')
time.sleep(0.5);
pyautogui.keyUp('right')
