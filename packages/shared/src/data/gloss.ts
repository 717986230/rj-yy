// 由 scripts/build_gloss.py 从 content/gloss/*.txt 生成，不要手改。
// 每行对应同一视频德语 / 英语字幕的同序号句子：词|词义 词|词义 … ## 谐音
export const GLOSS: Record<string, { de?: string[]; en?: string[] }> = {
 "big-buck-bunny": {
  "de": [
   "Ein|一个 Morgen|早晨 im|在…里 Wald.|森林 Die|这 Sonne|太阳 geht|升 auf.|起 ## 艾因 莫尔根 伊姆 瓦尔特。迪 索讷 盖特 奥夫。",
   "Am|在…边 Bach|小溪 ist|是 alles|一切 still.|安静的 ## 阿姆 巴赫 伊斯特 阿勒斯 施蒂尔。",
   "Unter|在…下面 dem|这个 Hügel|小山丘 ist|有 ein|一个 Bau.|洞穴 ## 温特 戴姆 许格尔 伊斯特 艾因 包。",
   "Hier|这里 schläft|睡觉 der|这只 große|大 Hase.|兔子 ## 希尔 施莱夫特 戴尔 格罗瑟 哈泽。",
   "Er|他 wacht|醒 auf|来 und|并且 kriecht|爬 aus|出 seinem|他的 Bau.|洞穴 ## 埃尔 瓦赫特 奥夫 温特 克里希特 奥斯 宰嫩 包。",
   "Er|他 streckt|伸展 sich.|自己 Was|多么 für|… ein|一个 schöner|美好的 Tag!|日子 ## 埃尔 施特雷克特 齐希。瓦斯 菲尔 艾因 晒讷 塔克！",
   "Er|他 riecht|闻 an|… den|这些 Blumen.|花 ## 埃尔 里希特 安 登 布卢门。",
   "Da|那里 liegt|躺着 ein|一个 Apfel.|苹果 Lecker!|好吃 ## 达 利克特 艾因 阿普费尔。莱克尔！",
   "Gemütlich|悠闲地 spaziert|散步 er|他 über|穿过 die|这片 Wiese.|草地 ## 格米特利希 施帕齐尔特 埃尔 于伯 迪 维泽。",
   "Ein|一只 Schmetterling|蝴蝶 fliegt|飞 um|围绕 ihn|他 herum.|四周 ## 艾因 施梅特林 弗利克特 乌姆 因 黑鲁姆。",
   "Hinter|在…后面 dem|这块 Stein|石头 versteckt|藏 sich|自己 jemand.|某人 ## 欣特 戴姆 施泰因 费尔施泰克特 齐希 耶曼特。",
   "Drei|三只 freche|调皮的 Tiere|动物 beobachten|观察 den|这只 Hasen.|兔子 ## 德赖 弗雷歇 蒂勒 贝奥巴赫滕 登 哈曾。",
   "Ein|一只 Flughörnchen,|鼯鼠 ein|一只 Eichhörnchen|松鼠 und|和 ein|一只 Chinchilla.|龙猫 ## 艾因 弗卢格赫恩兴，艾因 艾希赫恩兴 温特 艾因 钦奇拉。",
   "Sie|他们 werfen|扔 Nüsse|坚果 auf|向 ihn!|他 ## 齐 维尔芬 纽瑟 奥夫 因！",
   "Der|这只 Hase|兔子 bleibt|保持 ruhig.|平静 ## 戴尔 哈泽 布莱布特 鲁伊希。",
   "Jetzt|现在 ärgern|欺负 sie|他们 den|这只 Schmetterling.|蝴蝶 ## 耶茨特 埃尔格恩 齐 登 施梅特林。",
   "Der|这只 Hase|兔子 ist|是 entsetzt.|吓坏的 ## 戴尔 哈泽 伊斯特 恩特泽茨特。",
   "Jetzt|现在 ist|是 er|他 richtig|真的 wütend!|生气的 ## 耶茨特 伊斯特 埃尔 里希蒂希 维滕特！",
   "Im|在…里 Wald|树林 hat|有 er|他 eine|一个 Idee.|主意 ## 伊姆 瓦尔特 哈特 埃尔 艾讷 伊德。",
   "Er|他 baut|做 einen|一把 Bogen.|弓 ## 埃尔 包特 艾嫩 博根。",
   "Und|还 er|他 spitzt|削尖 Holzstöcke|木棍 an.|… ## 温特 埃尔 施皮茨特 霍尔茨施特克 安。",
   "Er|他 plant|计划 eine|一个 Falle.|陷阱 ## 埃尔 普兰特 艾讷 法勒。",
   "Die|这 drei|三个 frechen|调皮的 Tiere|动物 kommen|来 wieder.|又 ## 迪 德赖 弗雷兴 蒂勒 科门 维德。",
   "Der|这只 Hase|兔子 spannt|拉开 den|这把 Bogen.|弓 ## 戴尔 哈泽 施潘特 登 博根。",
   "Das|这只 Eichhörnchen|松鼠 bekommt|得到 einen|一个 Schreck!|惊吓 ## 达斯 艾希赫恩兴 贝科姆特 艾嫩 施雷克！",
   "Auch|也 das|这只 Chinchilla|龙猫 hat|有 keine|没有 Chance.|机会 ## 奥赫 达斯 钦奇拉 哈特 凯讷 尚瑟。",
   "Das|这只 Flughörnchen|鼯鼠 sitzt|坐 hoch|高 oben|上面 auf|在…上 dem|这根 Ast.|树枝 ## 达斯 弗卢格赫恩兴 齐茨特 霍赫 欧本 奥夫 戴姆 阿斯特。",
   "Es|它 breitet|张开 die|这 Arme|手臂 aus|开 und|并且 fliegt|飞 los.|出发 ## 埃斯 布赖特特 迪 阿尔默 奥斯 温特 弗利克特 洛斯。",
   "Ein|一个 Apfel|苹果 fällt|掉 herunter,|下来 mitten|正中 in|在…里 die|这些 spitzen|尖的 Stöcke.|木棍 ## 艾因 阿普费尔 费尔特 黑伦特，米滕 因 迪 施皮岑 施特克。",
   "Das|这只 Flughörnchen|鼯鼠 fliegt|飞 direkt|直接 auf|朝 die|这个 Falle|陷阱 zu.|… ## 达斯 弗卢格赫恩兴 弗利克特 迪雷克特 奥夫 迪 法勒 楚。",
   "Im|在 letzten|最后的 Moment|时刻 fängt|接住 der|这只 Hase|兔子 es|它 auf.|… ## 伊姆 莱茨滕 莫门特 芬特 戴尔 哈泽 埃斯 奥夫。",
   "Der|这只 Hase|兔子 tut|做 ihm|对它 nichts.|什么也不 ## 戴尔 哈泽 图特 伊姆 尼希茨。",
   "Ein|一只 Schmetterling|蝴蝶 kommt|来 geflogen.|飞着 Der|这只 Hase|兔子 lächelt.|微笑 ## 艾因 施梅特林 科姆特 格弗洛根。戴尔 哈泽 莱歇尔特。",
   "Und|那 das|这只 Flughörnchen?|鼯鼠呢 Das|它 ist|是 jetzt|现在 sein|他的 Drachen!|风筝 ## 温特 达斯 弗卢格赫恩兴？达斯 伊斯特 耶茨特 宰因 德拉亨！",
   "Das|这只 Flughörnchen|鼯鼠 fliegt|飞 weiter.|继续 Ende.|完 ## 达斯 弗卢格赫恩兴 弗利克特 魏特。恩德。"
  ]
 },
 "otti-intro": {
  "de": [
   "Hallo!|你好 Ich|我 bin|是 Otti,|Otti der|这只 kleine|小 Otter.|水獭 ## 哈喽！伊希 宾 奥蒂，戴尔 克莱讷 奥特。",
   "Jede|每张 Karte|卡片 ist|是 ein|一部 ganzer|完整的 Film.|电影 ## 耶德 卡尔特 伊斯特 艾因 甘策尔 菲尔姆。",
   "Zieh|抽 eine|一张 Karte|卡片 und|并且 schau|看 sie|它 von|从 Anfang|开头 bis|到 Ende.|结尾 ## 齐 艾讷 卡尔特 温特 少 齐 冯 安方 比斯 恩德。",
   "Chinesisch|中文 oben,|在上 Deutsch|德语 oder|或 Englisch|英语 unten.|在下 ## 希内吉施 欧本，多伊奇 欧德 恩格利施 温滕。"
  ]
 }
};
