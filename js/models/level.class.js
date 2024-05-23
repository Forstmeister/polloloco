class Level {
  enemies; // die Varaiblen erhalten nun die Werte aus dem constructor, da dieser zuerst aufgerufen wird.
  boss;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2175;

  constructor(enemies, boss, clouds, backgroundObjects, coins, bottles) {
    // hier werden die Arrays aus level_1 eingefügt
    this.enemies = enemies; // hier werden die arrays mit den äußeren Varaiblen verknüpft. dies geschieht mit this.
    this.boss = boss;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
