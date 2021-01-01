## SnakeBot

#### What does it do?
1. A rectangular food region will randomly be drawn in the canvas at the beginning of the game.
2. Food shall randomly appear but within this region.
3. Snake bot shall keep eating food and recording the coordinates of the food eaten.
4. SnakeBot will use the coordinates of the food to continue updating the predicion of where this food region is.
5. As soon as score becomes > 20. We assume that our predicted food region is close to actual region. Now instead of wasting time scanning whole canvas, the Snake will look for food only within this region which it has predicted.
