// 由 scripts/build_terra_x.py 生成，不要手改。德语字幕来自 Wikimedia Commons，中文和英文是翻译。
import type { LocalizedTitle, SubtitleTracks } from '../types';

export interface TerraXClip {
  id: string;
  title: LocalizedTitle;
  /** 相对 media/ 的路径 */
  file: string;
  duration: number;
  /** 署名与许可（CC BY / CC BY-SA 要求注明作者） */
  credit: string;
  /** Wikimedia Commons 上的原始文件页 */
  page: string;
  subtitles: SubtitleTracks;
}

export const TERRA_X_CLIPS: TerraXClip[] = [
  {
    "id": "terra-x-burgleben-im-mittelalter",
    "title": {
      "zh": "中世纪的城堡生活",
      "de": "Burgleben im Mittelalter",
      "en": "Castle Life in the Middle Ages"
    },
    "file": "terra-x/burgleben-im-mittelalter.mp4",
    "duration": 67.6,
    "credit": "ZDF/Terra X · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Burgleben_im_Mittelalter.webm",
    "subtitles": {
      "zh": [
        {
          "start": 0.75,
          "end": 4.21,
          "text": "中世纪的城堡里，往往已经有厕所了。"
        },
        {
          "start": 4.25,
          "end": 6.74,
          "text": "厕所是贴着外墙搭出来的。"
        },
        {
          "start": 6.78,
          "end": 8.92,
          "text": "一座小城堡有两三个厕所。"
        },
        {
          "start": 9.44,
          "end": 13.64,
          "text": "大领主的城堡里，有时甚至有二三十个。"
        },
        {
          "start": 13.68,
          "end": 16.68,
          "text": "一扇门把厕所和城堡的大厅隔开。"
        },
        {
          "start": 16.72,
          "end": 22.15,
          "text": "可在中世纪盛期，这扇门常常是敞开的，这样城堡主人还能继续参与谈话，"
        },
        {
          "start": 22.75,
          "end": 24.68,
          "text": "一边方便。"
        },
        {
          "start": 24.7,
          "end": 26.2,
          "text": "隐私？根本不存在。"
        },
        {
          "start": 27.15,
          "end": 32.87,
          "text": "当时每座城堡首先是一个经济单位，骑士老爷就是经营者。"
        },
        {
          "start": 32.89,
          "end": 38.92,
          "text": "整个中世纪，谷物都是主食，主要做成面包。"
        },
        {
          "start": 39.7,
          "end": 46.76,
          "text": "那时的啤酒酒精度比现在低，人们常拿它代替经常不干净的水来喝。"
        },
        {
          "start": 46.8,
          "end": 51.44,
          "text": "蔬菜很少上桌，更别说番茄、甜椒、玉米或土豆了，"
        },
        {
          "start": 52.06,
          "end": 56.37,
          "text": "这些是发现美洲之后才传到欧洲的。"
        },
        {
          "start": 56.41,
          "end": 58.05,
          "text": "肉也很贵。"
        },
        {
          "start": 58.11,
          "end": 63.36,
          "text": "中世纪盛期，一户农民一年大约只有二十公斤肉。"
        },
        {
          "start": 63.4,
          "end": 66.0,
          "text": "如今我们平均吃的是这个数的三倍。"
        }
      ],
      "de": [
        {
          "start": 0.75,
          "end": 4.21,
          "text": "Auf Burgen im Mittelalter gab es häufig sogar schon Toiletten."
        },
        {
          "start": 4.25,
          "end": 6.74,
          "text": "Diese waren an die Außenmauer angebaut."
        },
        {
          "start": 6.78,
          "end": 8.92,
          "text": "Eine kleine Burg hatte zwei oder drei Toiletten."
        },
        {
          "start": 9.44,
          "end": 13.64,
          "text": "Bei großen, landesherrlichen Burgen waren es auch schon mal zwanzig oder dreißig."
        },
        {
          "start": 13.68,
          "end": 16.68,
          "text": "Eine Tür trennte sie von den großen Burgräumen."
        },
        {
          "start": 16.72,
          "end": 22.15,
          "text": "Doch die blieb im Hochmittelalter oft noch offen, sodass der Herr des Hauses weiter am Gespräch teilnehmen konnte."
        },
        {
          "start": 22.75,
          "end": 24.68,
          "text": "während er sein Geschäft verrichtete."
        },
        {
          "start": 24.7,
          "end": 26.2,
          "text": "Privatsphäre Fehlanzeige."
        },
        {
          "start": 27.15,
          "end": 32.87,
          "text": "Jede Burg war damals vor allem ein Wirtschaftsbetrieb und der Herr Ritter war der Betriebsleiter."
        },
        {
          "start": 32.89,
          "end": 38.92,
          "text": "Getreide war das gesamte Mittelalter hindurch das Grundnahrungsmittel und wurde vor allem zu Brot verarbeitet."
        },
        {
          "start": 39.7,
          "end": 46.76,
          "text": "Bier hatte einen niedrigeren Alkoholgehalt als heute und wurde gern anstelle des häufig verunreinigten Wassers getrunken."
        },
        {
          "start": 46.8,
          "end": 51.44,
          "text": "Gemüse kam selten auf den Tisch, schon gar nicht Tomaten, Paprika, Mais oder Kartoffeln,"
        },
        {
          "start": 52.06,
          "end": 56.37,
          "text": "Die fanden erst mit der Entdeckung Amerikas ihren Weg nach Europa."
        },
        {
          "start": 56.41,
          "end": 58.05,
          "text": "Und Fleisch war teuer."
        },
        {
          "start": 58.11,
          "end": 63.36,
          "text": "Eine Bauernfamilie im Hochmittelalter musste mit rund zwanzig Kilo im Jahr auskommen."
        },
        {
          "start": 63.4,
          "end": 66.0,
          "text": "Heute verspeisen wir durchschnittlich das Dreifache."
        }
      ],
      "en": [
        {
          "start": 0.75,
          "end": 4.21,
          "text": "Medieval castles often already had toilets."
        },
        {
          "start": 4.25,
          "end": 6.74,
          "text": "They were built onto the outer wall."
        },
        {
          "start": 6.78,
          "end": 8.92,
          "text": "A small castle had two or three toilets."
        },
        {
          "start": 9.44,
          "end": 13.64,
          "text": "Large castles of territorial lords sometimes had twenty or thirty."
        },
        {
          "start": 13.68,
          "end": 16.68,
          "text": "A door separated them from the castle's great rooms."
        },
        {
          "start": 16.72,
          "end": 22.15,
          "text": "But in the High Middle Ages it often stayed open, so the lord of the house could keep taking part in the conversation"
        },
        {
          "start": 22.75,
          "end": 24.68,
          "text": "while he did his business."
        },
        {
          "start": 24.7,
          "end": 26.2,
          "text": "Privacy? None at all."
        },
        {
          "start": 27.15,
          "end": 32.87,
          "text": "Back then every castle was above all a business, and the knight was its manager."
        },
        {
          "start": 32.89,
          "end": 38.92,
          "text": "Throughout the Middle Ages grain was the staple food, mostly made into bread."
        },
        {
          "start": 39.7,
          "end": 46.76,
          "text": "Beer was weaker than today and was happily drunk instead of the often contaminated water."
        },
        {
          "start": 46.8,
          "end": 51.44,
          "text": "Vegetables rarely made it to the table, let alone tomatoes, peppers, corn or potatoes."
        },
        {
          "start": 52.06,
          "end": 56.37,
          "text": "They only reached Europe after the discovery of America."
        },
        {
          "start": 56.41,
          "end": 58.05,
          "text": "And meat was expensive."
        },
        {
          "start": 58.11,
          "end": 63.36,
          "text": "A peasant family in the High Middle Ages had to make do with about twenty kilos a year."
        },
        {
          "start": 63.4,
          "end": 66.0,
          "text": "Today we eat three times as much on average."
        }
      ]
    }
  },
  {
    "id": "terra-x-aufbau-und-funktion-eines-giraffenhalses",
    "title": {
      "zh": "长颈鹿的脖子是怎么长的",
      "de": "Aufbau und Funktion eines Giraffenhalses",
      "en": "How a Giraffe's Neck Works"
    },
    "file": "terra-x/aufbau-und-funktion-eines-giraffenhalses.mp4",
    "duration": 62.2,
    "credit": "ZDF/Terra X · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Aufbau_und_Funktion_eines_Giraffenhalses.webm",
    "subtitles": {
      "zh": [
        {
          "start": 1.73,
          "end": 5.24,
          "text": "长颈鹿生活在非洲的草原和稀树草原上。"
        },
        {
          "start": 5.31,
          "end": 8.39,
          "text": "它们可以长到六米高。"
        },
        {
          "start": 8.52,
          "end": 13.94,
          "text": "脖子长达 2.5 米，重约 250 公斤。"
        },
        {
          "start": 14.33,
          "end": 17.93,
          "text": "整根脖子只靠一条肌腱撑着。"
        },
        {
          "start": 18.22,
          "end": 20.55,
          "text": "虽然脖子这么长，"
        },
        {
          "start": 20.57,
          "end": 23.29,
          "text": "长颈鹿却只有七节颈椎，"
        },
        {
          "start": 23.32,
          "end": 26.77,
          "text": "和几乎所有其他哺乳动物一样。"
        },
        {
          "start": 27.26,
          "end": 29.82,
          "text": "只不过它的颈椎被拉得特别长。"
        },
        {
          "start": 30.62,
          "end": 33.49,
          "text": "长颈鹿的心脏重达十一公斤，"
        },
        {
          "start": 33.54,
          "end": 35.32,
          "text": "而且特别有力。"
        },
        {
          "start": 35.58,
          "end": 39.92,
          "text": "它每分钟能把多达 60 升血液泵到全身。"
        },
        {
          "start": 40.23,
          "end": 43.76,
          "text": "对血管来说，有一个特别的挑战："
        },
        {
          "start": 43.79,
          "end": 46.86,
          "text": "长颈鹿低头喝水的时候。"
        },
        {
          "start": 46.95,
          "end": 50.13,
          "text": "按理说，血会一下子冲进头部。"
        },
        {
          "start": 50.17,
          "end": 51.78,
          "text": "那会有生命危险。"
        },
        {
          "start": 51.9,
          "end": 54.98,
          "text": "在靠近大脑的地方，有一张有弹性的血管网。"
        },
        {
          "start": 55.02,
          "end": 59.29,
          "text": "它能多容纳一些血液，从而减轻压力。"
        }
      ],
      "de": [
        {
          "start": 1.73,
          "end": 5.24,
          "text": "Giraffen leben in den Steppen und Savannen Afrikas."
        },
        {
          "start": 5.31,
          "end": 8.39,
          "text": "Sie können eine Höhe von bis zu sechs Metern erreichen."
        },
        {
          "start": 8.52,
          "end": 13.94,
          "text": "Ihr Hals ist bis 2,50 Meter lang und wiegt rund 250 Kilogramm."
        },
        {
          "start": 14.33,
          "end": 17.93,
          "text": "Der Hals wird nur von einer einzigen Sehne gehalten."
        },
        {
          "start": 18.22,
          "end": 20.55,
          "text": "Doch obwohl sie einen so langen Hals haben,"
        },
        {
          "start": 20.57,
          "end": 23.29,
          "text": "besitzen Giraffen nur sieben Halswirbel,"
        },
        {
          "start": 23.32,
          "end": 26.77,
          "text": "so wie nahezu alle anderen Säugetiere auch."
        },
        {
          "start": 27.26,
          "end": 29.82,
          "text": "Allerdings sind die Halswirbel stark verlängert."
        },
        {
          "start": 30.62,
          "end": 33.49,
          "text": "Das Herz der Giraffe wiegt bis zu elf Kilogramm"
        },
        {
          "start": 33.54,
          "end": 35.32,
          "text": "und ist besonders leistungsstark."
        },
        {
          "start": 35.58,
          "end": 39.92,
          "text": "Es kann bis zu 60 Liter Blut pro Minute durch den Körper pumpen."
        },
        {
          "start": 40.23,
          "end": 43.76,
          "text": "Eine besondere Herausforderung an das Gefäßsystem ist es,"
        },
        {
          "start": 43.79,
          "end": 46.86,
          "text": "wenn die Giraffe den Kopf zum Trinken nach unten beugt."
        },
        {
          "start": 46.95,
          "end": 50.13,
          "text": "Eigentlich würde das Blut ungehindert in den Kopf schießen."
        },
        {
          "start": 50.17,
          "end": 51.78,
          "text": "Das wäre lebensgefährlich."
        },
        {
          "start": 51.9,
          "end": 54.98,
          "text": "Ein Netz elastischer Blutgefäße sitzt nahe am Hirn."
        },
        {
          "start": 55.02,
          "end": 59.29,
          "text": "Es nimmt zusätzlich Blut auf und führt somit zur Entlastung."
        }
      ],
      "en": [
        {
          "start": 1.73,
          "end": 5.24,
          "text": "Giraffes live in the steppes and savannas of Africa."
        },
        {
          "start": 5.31,
          "end": 8.39,
          "text": "They can reach a height of up to six metres."
        },
        {
          "start": 8.52,
          "end": 13.94,
          "text": "Their neck is up to 2.5 metres long and weighs about 250 kilograms."
        },
        {
          "start": 14.33,
          "end": 17.93,
          "text": "The neck is held up by a single tendon."
        },
        {
          "start": 18.22,
          "end": 20.55,
          "text": "But although their neck is so long,"
        },
        {
          "start": 20.57,
          "end": 23.29,
          "text": "giraffes have only seven neck vertebrae,"
        },
        {
          "start": 23.32,
          "end": 26.77,
          "text": "just like almost all other mammals."
        },
        {
          "start": 27.26,
          "end": 29.82,
          "text": "Their neck vertebrae are greatly elongated, though."
        },
        {
          "start": 30.62,
          "end": 33.49,
          "text": "A giraffe's heart weighs up to eleven kilograms"
        },
        {
          "start": 33.54,
          "end": 35.32,
          "text": "and is especially powerful."
        },
        {
          "start": 35.58,
          "end": 39.92,
          "text": "It can pump up to 60 litres of blood a minute through the body."
        },
        {
          "start": 40.23,
          "end": 43.76,
          "text": "A particular challenge for the blood vessels"
        },
        {
          "start": 43.79,
          "end": 46.86,
          "text": "is when the giraffe bends its head down to drink."
        },
        {
          "start": 46.95,
          "end": 50.13,
          "text": "Normally the blood would rush straight into the head."
        },
        {
          "start": 50.17,
          "end": 51.78,
          "text": "That would be life-threatening."
        },
        {
          "start": 51.9,
          "end": 54.98,
          "text": "A network of elastic blood vessels sits close to the brain."
        },
        {
          "start": 55.02,
          "end": 59.29,
          "text": "It takes up extra blood and so relieves the pressure."
        }
      ]
    }
  },
  {
    "id": "terra-x-das-jagdgeheimnis-der-florfliege",
    "title": {
      "zh": "草蛉的捕猎秘密",
      "de": "Das Jagdgeheimnis der Florfliege",
      "en": "The Lacewing's Hunting Secret"
    },
    "file": "terra-x/das-jagdgeheimnis-der-florfliege.mp4",
    "duration": 63.5,
    "credit": "ZDF TerraX/Daniela Busch · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Das_Jagdgeheimnis_der_Florfliege.webm",
    "subtitles": {
      "zh": [
        {
          "start": 1.43,
          "end": 4.92,
          "text": "这种动物有一个带气味的秘密："
        },
        {
          "start": 5.85,
          "end": 10.53,
          "text": "珍珠草蛉把卵产在白蚁窝附近。"
        },
        {
          "start": 13.86,
          "end": 17.53,
          "text": "幼虫孵出来后，就悄悄钻进蚁窝。"
        },
        {
          "start": 19.03,
          "end": 21.77,
          "text": "幼虫在里面遇到白蚁时，"
        },
        {
          "start": 21.81,
          "end": 26.38,
          "text": "会把屁股尖甩到猎物头部的高度，"
        },
        {
          "start": 26.41,
          "end": 28.23,
          "text": "然后放个屁。"
        },
        {
          "start": 31.27,
          "end": 36.05,
          "text": "它放出一种叫“异种信息素”的特殊化学物质，"
        },
        {
          "start": 36.06,
          "end": 38.28,
          "text": "能让猎物动弹不得。"
        },
        {
          "start": 39.27,
          "end": 43.69,
          "text": "一个屁就能同时放倒好几只虫子。"
        },
        {
          "start": 46.77,
          "end": 49.98,
          "text": "这种物质只会让白蚁瘫痪，"
        },
        {
          "start": 50.02,
          "end": 53.29,
          "text": "所以幼虫吃掉它们的时候，白蚁还是活的。"
        },
        {
          "start": 57.49,
          "end": 62.53,
          "text": "对在场的其他昆虫，这种物质完全没有作用。"
        }
      ],
      "de": [
        {
          "start": 1.43,
          "end": 4.92,
          "text": "Dieses Tier hat ein duftendes Geheimnis:"
        },
        {
          "start": 5.85,
          "end": 10.53,
          "text": "Perlenflorfliegen legen ihre Eier in der Nähe von Termitenbauten ab."
        },
        {
          "start": 13.86,
          "end": 17.53,
          "text": "Sind die Larven geschlüpft, schleichen sie in den Bau."
        },
        {
          "start": 19.03,
          "end": 21.77,
          "text": "Stößt eine Larve dort auf Termiten,"
        },
        {
          "start": 21.81,
          "end": 26.38,
          "text": "schwingt sie die Spitze ihres Hinterteils auf Kopfhöhe ihrer Opfer"
        },
        {
          "start": 26.41,
          "end": 28.23,
          "text": "und pupst."
        },
        {
          "start": 31.27,
          "end": 36.05,
          "text": "Dabei stößt sie ein Allomon, also eine besondere chemische Substanz aus,"
        },
        {
          "start": 36.06,
          "end": 38.28,
          "text": "mit der sie ihre Beute lahmlegt."
        },
        {
          "start": 39.27,
          "end": 43.69,
          "text": "Mit einem einzigen Pups kann die Larve gleich mehrere Insekten erledigen."
        },
        {
          "start": 46.77,
          "end": 49.98,
          "text": "Das Allomon führt nur zu einer Lähmung der Termiten,"
        },
        {
          "start": 50.02,
          "end": 53.29,
          "text": "so dass diese lebend von den Larven gefressen werden."
        },
        {
          "start": 57.49,
          "end": 62.53,
          "text": "Auf andere anwesende Insekten hat die Substanz keinerlei Einfluss."
        }
      ],
      "en": [
        {
          "start": 1.43,
          "end": 4.92,
          "text": "This animal has a smelly secret:"
        },
        {
          "start": 5.85,
          "end": 10.53,
          "text": "pearly green lacewings lay their eggs near termite mounds."
        },
        {
          "start": 13.86,
          "end": 17.53,
          "text": "Once the larvae hatch, they sneak into the nest."
        },
        {
          "start": 19.03,
          "end": 21.77,
          "text": "When a larva meets termites in there,"
        },
        {
          "start": 21.81,
          "end": 26.38,
          "text": "it swings the tip of its rear end up to its victims' head height"
        },
        {
          "start": 26.41,
          "end": 28.23,
          "text": "and farts."
        },
        {
          "start": 31.27,
          "end": 36.05,
          "text": "It releases an allomone, a special chemical substance,"
        },
        {
          "start": 36.06,
          "end": 38.28,
          "text": "that paralyses its prey."
        },
        {
          "start": 39.27,
          "end": 43.69,
          "text": "With a single fart the larva can knock out several insects at once."
        },
        {
          "start": 46.77,
          "end": 49.98,
          "text": "The allomone only paralyses the termites,"
        },
        {
          "start": 50.02,
          "end": 53.29,
          "text": "so the larvae eat them alive."
        },
        {
          "start": 57.49,
          "end": 62.53,
          "text": "The substance has no effect at all on other insects nearby."
        }
      ]
    }
  },
  {
    "id": "terra-x-darum-schlagt-der-blitz-in-baume-ein",
    "title": {
      "zh": "闪电为什么爱劈树",
      "de": "Darum schlägt der Blitz in Bäume ein",
      "en": "Why Lightning Strikes Trees"
    },
    "file": "terra-x/darum-schlagt-der-blitz-in-baume-ein.mp4",
    "duration": 79.8,
    "credit": "ZDF/3sat · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Darum_schl%C3%A4gt_der_Blitz_in_B%C3%A4ume_ein.webm",
    "subtitles": {
      "zh": [
        {
          "start": 0.0,
          "end": 2.0,
          "text": "在强烈的上升气流中，"
        },
        {
          "start": 2.0,
          "end": 3.5,
          "text": "雷雨云里"
        },
        {
          "start": 3.5,
          "end": 6.5,
          "text": "小水滴和细小的冰晶互相摩擦。"
        },
        {
          "start": 6.5,
          "end": 9.0,
          "text": "这时水滴带上正电，"
        },
        {
          "start": 9.0,
          "end": 11.5,
          "text": "细小的冰晶带上负电。"
        },
        {
          "start": 11.5,
          "end": 13.25,
          "text": "水滴往下沉。"
        },
        {
          "start": 13.25,
          "end": 16.75,
          "text": "于是正电荷和负电荷分开了。"
        },
        {
          "start": 16.75,
          "end": 20.0,
          "text": "由此产生的电压高达几百万伏。"
        },
        {
          "start": 20.0,
          "end": 25.0,
          "text": "现在负电荷主要聚集在云的下层。"
        },
        {
          "start": 25.0,
          "end": 29.0,
          "text": "这让地面带上越来越多的正电。"
        },
        {
          "start": 29.0,
          "end": 31.5,
          "text": "电场形成了。"
        },
        {
          "start": 31.5,
          "end": 33.75,
          "text": "电压大到一定程度时，"
        },
        {
          "start": 33.75,
          "end": 37.8,
          "text": "云和地面的电荷就要互相抵消。"
        },
        {
          "start": 37.8,
          "end": 41.4,
          "text": "电荷交换的准备过程很复杂："
        },
        {
          "start": 41.4,
          "end": 43.5,
          "text": "最后会形成一条电荷通道。"
        },
        {
          "start": 43.5,
          "end": 46.0,
          "text": "之后闪电电流就能从这里流过。"
        },
        {
          "start": 46.0,
          "end": 48.5,
          "text": "通道接近地面时，"
        },
        {
          "start": 48.5,
          "end": 51.5,
          "text": "地面的正电荷会增强。"
        },
        {
          "start": 51.5,
          "end": 54.4,
          "text": "在电荷通道容易到达的地方，"
        },
        {
          "start": 54.4,
          "end": 56.4,
          "text": "电压特别高。"
        },
        {
          "start": 56.4,
          "end": 59.0,
          "text": "比如一棵高高的树上。"
        },
        {
          "start": 59.0,
          "end": 63.5,
          "text": "带负电的通道在那里碰上正电荷，"
        },
        {
          "start": 63.5,
          "end": 67.0,
          "text": "云和大地就连通了。"
        },
        {
          "start": 67.0,
          "end": 68.0,
          "text": "闪电电流"
        },
        {
          "start": 68.0,
          "end": 70.0,
          "text": "瞬间就流了过去。"
        },
        {
          "start": 70.0,
          "end": 79.7,
          "text": "[轻柔的背景音乐继续]"
        }
      ],
      "de": [
        {
          "start": 0.0,
          "end": 2.0,
          "text": "Bei starken Aufwinden"
        },
        {
          "start": 2.0,
          "end": 3.5,
          "text": "reiben in einer Gewitterwolke"
        },
        {
          "start": 3.5,
          "end": 6.5,
          "text": "Wassertröpchen und kleine Eiskristalle aneinander."
        },
        {
          "start": 6.5,
          "end": 9.0,
          "text": "Dabei laden sich die Tröpchen positiv,"
        },
        {
          "start": 9.0,
          "end": 11.5,
          "text": "die feinen Kristalle negativ auf."
        },
        {
          "start": 11.5,
          "end": 13.25,
          "text": "Die Tröpchen sinken ab."
        },
        {
          "start": 13.25,
          "end": 16.75,
          "text": "Dadurch trennen sich die positiven von den negativen Ladungen."
        },
        {
          "start": 16.75,
          "end": 20.0,
          "text": "Die enstehende Spannung erreicht einige Millionen Volt."
        },
        {
          "start": 20.0,
          "end": 25.0,
          "text": "Jetzt halten sich hauptsächlich negative Ladungen in den unteren Wolkenschichten auf."
        },
        {
          "start": 25.0,
          "end": 29.0,
          "text": "Das bewirkt eine zunehmend positive Aufladung der Erdoberfläche."
        },
        {
          "start": 29.0,
          "end": 31.5,
          "text": "Ein elektrisches Feld ensteht."
        },
        {
          "start": 31.5,
          "end": 33.75,
          "text": "Irgendwann ist die Spannung so stark,"
        },
        {
          "start": 33.75,
          "end": 37.8,
          "text": "daß sich die Ladungen von Wolke und Erdoberfläche ausgleichen wollen."
        },
        {
          "start": 37.8,
          "end": 41.4,
          "text": "Die Anbahnung des Ladungsaustauschs ist kompliziert:"
        },
        {
          "start": 41.4,
          "end": 43.5,
          "text": "Schließlich bildet sich ein Ladungskanal."
        },
        {
          "start": 43.5,
          "end": 46.0,
          "text": "Durch ihn kann später der Blitzstrom fließen."
        },
        {
          "start": 46.0,
          "end": 48.5,
          "text": "Nähert sich der Kanal der Erdoberfläche"
        },
        {
          "start": 48.5,
          "end": 51.5,
          "text": "verstärkt sich ihre positive Ladung."
        },
        {
          "start": 51.5,
          "end": 54.4,
          "text": "An Stellen, die der Ladungsschlauch gut erreicht,"
        },
        {
          "start": 54.4,
          "end": 56.4,
          "text": "ist die Spannung besonders hoch."
        },
        {
          "start": 56.4,
          "end": 59.0,
          "text": "Zum Beispiel an einem hohem Baum."
        },
        {
          "start": 59.0,
          "end": 63.5,
          "text": "Trifft der negative Ladungsschlauch dort auf eine positive Ladung,"
        },
        {
          "start": 63.5,
          "end": 67.0,
          "text": "steht die Verbindung zwischen Wolke und Erde."
        },
        {
          "start": 67.0,
          "end": 68.0,
          "text": "Der Blitzstrom"
        },
        {
          "start": 68.0,
          "end": 70.0,
          "text": "kann schlagartig fließen."
        },
        {
          "start": 70.0,
          "end": 79.7,
          "text": "[leichte Musikuntermalung setzt sich fort]"
        }
      ],
      "en": [
        {
          "start": 0.0,
          "end": 2.0,
          "text": "In strong updrafts"
        },
        {
          "start": 2.0,
          "end": 3.5,
          "text": "inside a thundercloud,"
        },
        {
          "start": 3.5,
          "end": 6.5,
          "text": "water droplets and tiny ice crystals rub against each other."
        },
        {
          "start": 6.5,
          "end": 9.0,
          "text": "The droplets become positively charged,"
        },
        {
          "start": 9.0,
          "end": 11.5,
          "text": "the fine crystals negatively charged."
        },
        {
          "start": 11.5,
          "end": 13.25,
          "text": "The droplets sink."
        },
        {
          "start": 13.25,
          "end": 16.75,
          "text": "This separates the positive from the negative charges."
        },
        {
          "start": 16.75,
          "end": 20.0,
          "text": "The resulting voltage reaches several million volts."
        },
        {
          "start": 20.0,
          "end": 25.0,
          "text": "Now mainly negative charges sit in the lower layers of the cloud."
        },
        {
          "start": 25.0,
          "end": 29.0,
          "text": "That makes the ground more and more positively charged."
        },
        {
          "start": 29.0,
          "end": 31.5,
          "text": "An electric field forms."
        },
        {
          "start": 31.5,
          "end": 33.75,
          "text": "At some point the voltage is so strong"
        },
        {
          "start": 33.75,
          "end": 37.8,
          "text": "that the charges of cloud and ground want to balance out."
        },
        {
          "start": 37.8,
          "end": 41.4,
          "text": "Getting the charge exchange going is complicated:"
        },
        {
          "start": 41.4,
          "end": 43.5,
          "text": "in the end a charge channel forms."
        },
        {
          "start": 43.5,
          "end": 46.0,
          "text": "Later the lightning current can flow through it."
        },
        {
          "start": 46.0,
          "end": 48.5,
          "text": "As the channel approaches the ground,"
        },
        {
          "start": 48.5,
          "end": 51.5,
          "text": "the ground's positive charge grows stronger."
        },
        {
          "start": 51.5,
          "end": 54.4,
          "text": "At spots the charge channel can reach easily,"
        },
        {
          "start": 54.4,
          "end": 56.4,
          "text": "the voltage is especially high."
        },
        {
          "start": 56.4,
          "end": 59.0,
          "text": "For example on a tall tree."
        },
        {
          "start": 59.0,
          "end": 63.5,
          "text": "If the negative channel meets a positive charge there,"
        },
        {
          "start": 63.5,
          "end": 67.0,
          "text": "cloud and earth are connected."
        },
        {
          "start": 67.0,
          "end": 68.0,
          "text": "The lightning current"
        },
        {
          "start": 68.0,
          "end": 70.0,
          "text": "can flow in an instant."
        },
        {
          "start": 70.0,
          "end": 79.7,
          "text": "[soft background music continues]"
        }
      ]
    }
  },
  {
    "id": "terra-x-blue-holes-auf-den-bahamas-cc-by-4-0",
    "title": {
      "zh": "巴哈马的蓝洞",
      "de": "Blue Holes auf den Bahamas",
      "en": "The Blue Holes of the Bahamas"
    },
    "file": "terra-x/blue-holes-auf-den-bahamas-cc-by-4-0.mp4",
    "duration": 92.1,
    "credit": "ZDF/Terra X · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Blue_Holes_auf_den_Bahamas_(CC_BY_4.0).webm",
    "subtitles": {
      "zh": [
        {
          "start": 3.26,
          "end": 8.11,
          "text": "巴哈马大约有 1000 个蓝洞，也就是“蓝色的洞”，"
        },
        {
          "start": 8.14,
          "end": 10.69,
          "text": "比世界上任何地方都多。"
        },
        {
          "start": 10.84,
          "end": 14.57,
          "text": "蓝洞是被海水淹没的洞穴系统。"
        },
        {
          "start": 14.62,
          "end": 16.93,
          "text": "这些洞穴不只在海边，"
        },
        {
          "start": 16.97,
          "end": 20.83,
          "text": "也在内陆，比如这里的阿巴科群岛。"
        },
        {
          "start": 21.55,
          "end": 25.23,
          "text": "这些古老的洞穴形成于几千年前。"
        },
        {
          "start": 25.33,
          "end": 28.14,
          "text": "钟乳石也是那时候形成的。"
        },
        {
          "start": 28.47,
          "end": 31.62,
          "text": "根据钟乳石沉积的层次，"
        },
        {
          "start": 31.65,
          "end": 35.25,
          "text": "可以推断出远古时期的气候。"
        },
        {
          "start": 35.97,
          "end": 40.84,
          "text": "所以巴哈马的蓝洞是地球历史的档案馆。"
        },
        {
          "start": 41.32,
          "end": 45.12,
          "text": "那这些地质珍宝是怎么形成的呢？"
        },
        {
          "start": 47.22,
          "end": 48.95,
          "text": "冰河时期，"
        },
        {
          "start": 49.0,
          "end": 52.08,
          "text": "冰川让全球海平面"
        },
        {
          "start": 52.11,
          "end": 54.84,
          "text": "下降了多达 130 米。"
        },
        {
          "start": 56.96,
          "end": 60.19,
          "text": "组成巴哈马地基的石灰岩礁石平台"
        },
        {
          "start": 60.25,
          "end": 63.68,
          "text": "大片露出了水面。"
        },
        {
          "start": 66.27,
          "end": 69.8,
          "text": "雨水从裂缝渗进去，溶解了石灰岩，"
        },
        {
          "start": 69.83,
          "end": 72.76,
          "text": "形成了四通八达的喀斯特溶洞。"
        },
        {
          "start": 72.88,
          "end": 77.36,
          "text": "洞顶塌下来，就成了典型的圆形洞口。"
        },
        {
          "start": 79.47,
          "end": 81.5,
          "text": "末次冰期结束时，"
        },
        {
          "start": 81.56,
          "end": 85.32,
          "text": "海平面重新上升，淹没了这些洞穴。"
        }
      ],
      "de": [
        {
          "start": 3.26,
          "end": 8.11,
          "text": "Auf den Bahamas gibt es rund 1000 Blue Holes, blaue Löcher,"
        },
        {
          "start": 8.14,
          "end": 10.69,
          "text": "mehr als irgendwo sonst auf der Welt."
        },
        {
          "start": 10.84,
          "end": 14.57,
          "text": "Blue Holes sind Höhlensysteme von Meerwasser geflutet."
        },
        {
          "start": 14.62,
          "end": 16.93,
          "text": "Die Höhlen liegen nicht nur am Meer,"
        },
        {
          "start": 16.97,
          "end": 20.83,
          "text": "sondern auch im Inland, wie hier auf den Abaco-Inseln."
        },
        {
          "start": 21.55,
          "end": 25.23,
          "text": "Die urzeitlichen Höhlen entstanden vor Tausenden von Jahren."
        },
        {
          "start": 25.33,
          "end": 28.14,
          "text": "Damals bildeten sich auch die Tropfsteine."
        },
        {
          "start": 28.47,
          "end": 31.62,
          "text": "Anhand der Abfolge der Tropfsteinablagerungen"
        },
        {
          "start": 31.65,
          "end": 35.25,
          "text": "kann man Rückschlüsse auf das Klima vergangener Zeiten ziehen."
        },
        {
          "start": 35.97,
          "end": 40.84,
          "text": "Damit sind die Blue Holes auf den Bahamas Archive der Erdgeschichte."
        },
        {
          "start": 41.32,
          "end": 45.12,
          "text": "Doch wie sind die geologischen Kostbarkeiten entstanden?"
        },
        {
          "start": 47.22,
          "end": 48.95,
          "text": "Während der Eiszeit"
        },
        {
          "start": 49.0,
          "end": 52.08,
          "text": "ließ die Vergletscherung den Meeresspiegel weltweit"
        },
        {
          "start": 52.11,
          "end": 54.84,
          "text": "um bis zu 130 Meter sinken."
        },
        {
          "start": 56.96,
          "end": 60.19,
          "text": "Weite Teile der Riff-Plattformen aus Kalkstein,"
        },
        {
          "start": 60.25,
          "end": 63.68,
          "text": "die den Untergrund der Bahamas bilden, fielen trocken."
        },
        {
          "start": 66.27,
          "end": 69.8,
          "text": "Durch Risse drang Regen ein und löste den Kalk auf,"
        },
        {
          "start": 69.83,
          "end": 72.76,
          "text": "weitverzweigte Karsthöhlen entstanden."
        },
        {
          "start": 72.88,
          "end": 77.36,
          "text": "Eingestürzte Höhlendecken bildeten die charakteristischen runden Löcher."
        },
        {
          "start": 79.47,
          "end": 81.5,
          "text": "Am Ende der letzten Eiszeit"
        },
        {
          "start": 81.56,
          "end": 85.32,
          "text": "stieg der Meeresspiegel wieder an und flutete die Höhlen."
        }
      ],
      "en": [
        {
          "start": 3.26,
          "end": 8.11,
          "text": "The Bahamas have around 1,000 blue holes,"
        },
        {
          "start": 8.14,
          "end": 10.69,
          "text": "more than anywhere else in the world."
        },
        {
          "start": 10.84,
          "end": 14.57,
          "text": "Blue holes are cave systems flooded with seawater."
        },
        {
          "start": 14.62,
          "end": 16.93,
          "text": "The caves are not only by the sea"
        },
        {
          "start": 16.97,
          "end": 20.83,
          "text": "but also inland, like here on the Abaco Islands."
        },
        {
          "start": 21.55,
          "end": 25.23,
          "text": "These ancient caves formed thousands of years ago."
        },
        {
          "start": 25.33,
          "end": 28.14,
          "text": "That is also when the stalactites formed."
        },
        {
          "start": 28.47,
          "end": 31.62,
          "text": "From the sequence of the stalactite deposits"
        },
        {
          "start": 31.65,
          "end": 35.25,
          "text": "we can draw conclusions about past climates."
        },
        {
          "start": 35.97,
          "end": 40.84,
          "text": "That makes the blue holes of the Bahamas archives of Earth's history."
        },
        {
          "start": 41.32,
          "end": 45.12,
          "text": "But how did these geological treasures form?"
        },
        {
          "start": 47.22,
          "end": 48.95,
          "text": "During the Ice Age"
        },
        {
          "start": 49.0,
          "end": 52.08,
          "text": "glaciation lowered sea levels worldwide"
        },
        {
          "start": 52.11,
          "end": 54.84,
          "text": "by up to 130 metres."
        },
        {
          "start": 56.96,
          "end": 60.19,
          "text": "Large parts of the limestone reef platforms"
        },
        {
          "start": 60.25,
          "end": 63.68,
          "text": "that form the ground of the Bahamas fell dry."
        },
        {
          "start": 66.27,
          "end": 69.8,
          "text": "Rain seeped in through cracks and dissolved the limestone,"
        },
        {
          "start": 69.83,
          "end": 72.76,
          "text": "creating widely branching karst caves."
        },
        {
          "start": 72.88,
          "end": 77.36,
          "text": "Collapsed cave roofs formed the typical round holes."
        },
        {
          "start": 79.47,
          "end": 81.5,
          "text": "At the end of the last Ice Age"
        },
        {
          "start": 81.56,
          "end": 85.32,
          "text": "the sea level rose again and flooded the caves."
        }
      ]
    }
  },
  {
    "id": "terra-x-ddr-kultauto-trabant",
    "title": {
      "zh": "东德经典汽车卫星牌",
      "de": "DDR-Kultauto Trabant",
      "en": "The Trabant, East Germany's Cult Car"
    },
    "file": "terra-x/ddr-kultauto-trabant.mp4",
    "duration": 86.8,
    "credit": "ZDF/Terra X · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:DDR-Kultauto_Trabant.webm",
    "subtitles": {
      "zh": [
        {
          "start": 0.6,
          "end": 4.4,
          "text": "卫星牌汽车（Trabant）是 50 年代和冷战的产物。"
        },
        {
          "start": 5.6,
          "end": 10.8,
          "text": "和同时代的其他汽车一样，它的车身骨架是钢板做的。"
        },
        {
          "start": 11.6,
          "end": 19.4,
          "text": "独特的是，它的外壳不用常见的铁皮，而是用一种叫 Duroplast 的塑料。这是迫不得已的创新。"
        },
        {
          "start": 19.6,
          "end": 26.8,
          "text": "1950 年，西方禁止向东方阵营出口钢材和铁皮，而自己生产又很贵。"
        },
        {
          "start": 27.4,
          "end": 37.6,
          "text": "Duroplast 用的是东德能弄到的便宜材料：苏联的棉花，加上本国煤炭生产中的合成树脂颗粒。"
        },
        {
          "start": 38.8,
          "end": 44.6,
          "text": "两者在高温下压制成型。Duroplast 结实，而且不生锈。"
        },
        {
          "start": 47.8,
          "end": 51.6,
          "text": "这辆车因为这种材料，得了个外号叫“塑料轰炸机”。"
        },
        {
          "start": 54.0,
          "end": 64.4,
          "text": "“Trabant”这个名字来自当时的航天热。1957 年，苏联把第一颗人造地球卫星“斯普特尼克”送上了太空。"
        },
        {
          "start": 67.4,
          "end": 77.4,
          "text": "为了纪念它，这款东德新车被命名为 Trabant。因为和俄语的“斯普特尼克”一样，古捷克语的“trabant”在德语里的意思是“同伴”。"
        },
        {
          "start": 77.8,
          "end": 86.4,
          "text": "在天文学里，Trabant 指沿固定轨道绕行星运转的天体，就像月亮绕着地球。"
        }
      ],
      "de": [
        {
          "start": 0.6,
          "end": 4.4,
          "text": "Der Trabant ist ein Kind der 50er und des Kalten Krieges."
        },
        {
          "start": 5.6,
          "end": 10.8,
          "text": "Wie bei jedem anderen Auto seiner Zeit ist sein Karosserie-Gerippe aus Stahlblech."
        },
        {
          "start": 11.6,
          "end": 19.4,
          "text": "Einzigartig sind seine Kunststoffteile aus Duroplast anstelle des üblichen Blechs. Eine Innovation, die aus der Not geboren ist."
        },
        {
          "start": 19.6,
          "end": 26.8,
          "text": "1950 hat der Westen die Ausfuhr von Stahl und Blech in den Ostblock verboten. Und die eigene Herstellung ist teuer."
        },
        {
          "start": 27.4,
          "end": 37.6,
          "text": "Duroplast besteht aus in der DDR verfügbaren Billigprodukten: Baumwolle aus der Sowjetunion und Kunstharzteilchen aus der heimischen Steinkohleproduktion."
        },
        {
          "start": 38.8,
          "end": 44.6,
          "text": "Beides zusammen wird bei großer Hitze gepresst. Duroplast ist stabil und rostet nicht."
        },
        {
          "start": 47.8,
          "end": 51.6,
          "text": "Dem Werkstoff verdankt das Auto den Spitznamen „Plastebomber“."
        },
        {
          "start": 54.0,
          "end": 64.4,
          "text": "Der Name Trabant entspringt der Raumfahrtbegeisterung jener Zeit. 1957 schießt die Sowjetunion den ersten künstlichen Erdsatelliten ins All – Sputnik."
        },
        {
          "start": 67.4,
          "end": 77.4,
          "text": "Ihm zu Ehren wird das neue DDR-Auto Trabant getauft. Denn wie das russische „Sputnik“ bedeutet das alttschechische Wort „trabant“ auf Deutsch „Begleiter“."
        },
        {
          "start": 77.8,
          "end": 86.4,
          "text": "In der Astronomie ist der Trabant ein Himmelskörper, der einen Planeten auf einer festen Bahn umkreist – so wie der Mond die Erde."
        }
      ],
      "en": [
        {
          "start": 0.6,
          "end": 4.4,
          "text": "The Trabant is a child of the 1950s and the Cold War."
        },
        {
          "start": 5.6,
          "end": 10.8,
          "text": "Like every other car of its time, its body frame is made of sheet steel."
        },
        {
          "start": 11.6,
          "end": 19.4,
          "text": "What is unique are its plastic panels made of Duroplast instead of the usual sheet metal. An innovation born of necessity."
        },
        {
          "start": 19.6,
          "end": 26.8,
          "text": "In 1950 the West banned exports of steel and sheet metal to the Eastern Bloc, and making it yourself is expensive."
        },
        {
          "start": 27.4,
          "end": 37.6,
          "text": "Duroplast is made of cheap products available in the GDR: cotton from the Soviet Union and resin particles from the country's own hard coal production."
        },
        {
          "start": 38.8,
          "end": 44.6,
          "text": "The two are pressed together at high heat. Duroplast is sturdy and does not rust."
        },
        {
          "start": 47.8,
          "end": 51.6,
          "text": "The car owes its nickname 'plastic bomber' to this material."
        },
        {
          "start": 54.0,
          "end": 64.4,
          "text": "The name Trabant comes from the space enthusiasm of the time. In 1957 the Soviet Union launched the first artificial satellite into space – Sputnik."
        },
        {
          "start": 67.4,
          "end": 77.4,
          "text": "In its honour the new GDR car was named Trabant. Like the Russian 'Sputnik', the old Czech word 'trabant' means 'companion' in German."
        },
        {
          "start": 77.8,
          "end": 86.4,
          "text": "In astronomy a trabant is a body that circles a planet on a fixed orbit – like the Moon around the Earth."
        }
      ]
    }
  },
  {
    "id": "terra-x-catalhoyuk-erste-grosiedlung-der-menschheit-cc-by-4",
    "title": {
      "zh": "加泰土丘：人类第一座大型聚落",
      "de": "Catalhöyük, erste Großsiedlung der Menschheit",
      "en": "Çatalhöyük, Humanity's First Large Settlement"
    },
    "file": "terra-x/catalhoyuk-erste-grosiedlung-der-menschheit-cc-by-4-0.mp4",
    "duration": 92.6,
    "credit": "ZDF/Terra X · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Catalh%C3%B6y%C3%BCk,_erste_Gro%C3%9Fsiedlung_der_Menschheit_(CC_by_4.0).webm",
    "subtitles": {
      "zh": [
        {
          "start": 3.19,
          "end": 7.25,
          "text": "加泰土丘是世界历史上第一座大型聚落。"
        },
        {
          "start": 7.29,
          "end": 11.93,
          "text": "它大约在 9500 年前出现在今天的土耳其。"
        },
        {
          "start": 12.2,
          "end": 16.29,
          "text": "鼎盛时期，那里住着多达 2500 人，"
        },
        {
          "start": 16.33,
          "end": 21.74,
          "text": "一户挨着一户住在长方形的房子里，只能从屋顶进出。"
        },
        {
          "start": 22.0,
          "end": 23.98,
          "text": "这种建筑很实用，"
        },
        {
          "start": 24.04,
          "end": 28.5,
          "text": "因为大窗大门会让屋里太热。"
        },
        {
          "start": 28.5,
          "end": 30.75,
          "text": "那里没有街道，也没有广场。"
        },
        {
          "start": 30.78,
          "end": 33.8,
          "text": "生活主要在屋顶上进行。"
        },
        {
          "start": 33.8,
          "end": 37.09,
          "text": "那显然是一个人人平等的社会。"
        },
        {
          "start": 37.14,
          "end": 42.49,
          "text": "既没有宫殿，也没有神庙，连集市和作坊都没有。"
        },
        {
          "start": 42.52,
          "end": 45.48,
          "text": "每户人家自己经营，"
        },
        {
          "start": 45.51,
          "end": 49.26,
          "text": "自己养牲畜、做工具。"
        },
        {
          "start": 50.28,
          "end": 52.22,
          "text": "不过居民们也得应付"
        },
        {
          "start": 52.24,
          "end": 55.28,
          "text": "文明社会的典型问题，"
        },
        {
          "start": 55.31,
          "end": 58.84,
          "text": "比如怎么处理垃圾和粪便。"
        },
        {
          "start": 60.23,
          "end": 63.61,
          "text": "但总体来说，这个社群大概很稳定，"
        },
        {
          "start": 63.61,
          "end": 67.34,
          "text": "因为加泰土丘有人居住了两千年。"
        },
        {
          "start": 68.21,
          "end": 71.11,
          "text": "人们不只在屋里生活，"
        },
        {
          "start": 71.11,
          "end": 74.29,
          "text": "还在那里举行宗教节庆。"
        },
        {
          "start": 75.75,
          "end": 80.29,
          "text": "墙上大幅彩色的狩猎壁画就是证据。"
        },
        {
          "start": 80.5,
          "end": 84.83,
          "text": "这些画可能是为了纪念成年礼"
        },
        {
          "start": 84.84,
          "end": 87.47,
          "text": "或者祭祀性的狩猎。"
        }
      ],
      "de": [
        {
          "start": 3.19,
          "end": 7.25,
          "text": "Çatalhöyük war die erste Großsiedlung der Weltgeschichte."
        },
        {
          "start": 7.29,
          "end": 11.93,
          "text": "Sie entstand vor etwa 9500 Jahren in der heutigen Türkei."
        },
        {
          "start": 12.2,
          "end": 16.29,
          "text": "In der Blütezeit lebten dort bis zu 2500 Menschen,"
        },
        {
          "start": 16.33,
          "end": 21.74,
          "text": "dicht an dicht in rechteckigen Häusern, die nur über das Dach zugänglich waren."
        },
        {
          "start": 22.0,
          "end": 23.98,
          "text": "Eine zweckdienliche Architektur,"
        },
        {
          "start": 24.04,
          "end": 28.5,
          "text": "denn große Fenster und Türen hätten die Innenräume zu sehr aufgeheizt."
        },
        {
          "start": 28.5,
          "end": 30.75,
          "text": "Straßen und Plätze gab es nicht."
        },
        {
          "start": 30.78,
          "end": 33.8,
          "text": "Das Leben spielte sich vornehmlich auf den Dächern ab."
        },
        {
          "start": 33.8,
          "end": 37.09,
          "text": "Es war offenbar eine gleichberechtigte Gesellschaft."
        },
        {
          "start": 37.14,
          "end": 42.49,
          "text": "Es gab weder Paläste noch Tempel, auch Marktplätze und Werkstätten fehlten."
        },
        {
          "start": 42.52,
          "end": 45.48,
          "text": "Jede Hausgemeinschaft wirtschaftete selbstständig,"
        },
        {
          "start": 45.51,
          "end": 49.26,
          "text": "kümmerte sich um die Tierhaltung und stellte Werkzeuge her."
        },
        {
          "start": 50.28,
          "end": 52.22,
          "text": "Die Bewohner mussten sich aber auch"
        },
        {
          "start": 52.24,
          "end": 55.28,
          "text": "mit typischen Problemen der Zivilisation herumschlagen,"
        },
        {
          "start": 55.31,
          "end": 58.84,
          "text": "unter anderem mit der Entsorgung von Abfällen und Fäkalien."
        },
        {
          "start": 60.23,
          "end": 63.61,
          "text": "Doch insgesamt war die Gemeinschaft wohl stabil,"
        },
        {
          "start": 63.61,
          "end": 67.34,
          "text": "denn Çatalhöyük blieb zwei Jahrtausende lang bewohnt."
        },
        {
          "start": 68.21,
          "end": 71.11,
          "text": "In den Häusern lebten die Menschen aber nicht nur,"
        },
        {
          "start": 71.11,
          "end": 74.29,
          "text": "sie feierten dort auch rituelle Feste."
        },
        {
          "start": 75.75,
          "end": 80.29,
          "text": "Davon zeugen große Wandbilder mit farbigen Jagdszenen."
        },
        {
          "start": 80.5,
          "end": 84.83,
          "text": "Vermutlich sollten die Darstellungen an Initiationsriten"
        },
        {
          "start": 84.84,
          "end": 87.47,
          "text": "oder kultische Jagden erinnern."
        }
      ],
      "en": [
        {
          "start": 3.19,
          "end": 7.25,
          "text": "Çatalhöyük was the first large settlement in world history."
        },
        {
          "start": 7.29,
          "end": 11.93,
          "text": "It arose about 9,500 years ago in what is now Turkey."
        },
        {
          "start": 12.2,
          "end": 16.29,
          "text": "At its peak up to 2,500 people lived there,"
        },
        {
          "start": 16.33,
          "end": 21.74,
          "text": "packed closely in rectangular houses that could only be entered through the roof."
        },
        {
          "start": 22.0,
          "end": 23.98,
          "text": "A practical architecture,"
        },
        {
          "start": 24.04,
          "end": 28.5,
          "text": "because big windows and doors would have overheated the rooms."
        },
        {
          "start": 28.5,
          "end": 30.75,
          "text": "There were no streets or squares."
        },
        {
          "start": 30.78,
          "end": 33.8,
          "text": "Life mostly took place on the roofs."
        },
        {
          "start": 33.8,
          "end": 37.09,
          "text": "It was apparently an egalitarian society."
        },
        {
          "start": 37.14,
          "end": 42.49,
          "text": "There were no palaces or temples, and no market squares or workshops either."
        },
        {
          "start": 42.52,
          "end": 45.48,
          "text": "Each household ran its own affairs,"
        },
        {
          "start": 45.51,
          "end": 49.26,
          "text": "kept its own animals and made tools."
        },
        {
          "start": 50.28,
          "end": 52.22,
          "text": "But the inhabitants also had to deal"
        },
        {
          "start": 52.24,
          "end": 55.28,
          "text": "with typical problems of civilisation,"
        },
        {
          "start": 55.31,
          "end": 58.84,
          "text": "including getting rid of rubbish and faeces."
        },
        {
          "start": 60.23,
          "end": 63.61,
          "text": "Overall, though, the community was probably stable,"
        },
        {
          "start": 63.61,
          "end": 67.34,
          "text": "because Çatalhöyük stayed inhabited for two thousand years."
        },
        {
          "start": 68.21,
          "end": 71.11,
          "text": "People didn't just live in their houses,"
        },
        {
          "start": 71.11,
          "end": 74.29,
          "text": "they also held ritual celebrations there."
        },
        {
          "start": 75.75,
          "end": 80.29,
          "text": "Large murals with colourful hunting scenes bear witness to this."
        },
        {
          "start": 80.5,
          "end": 84.83,
          "text": "The pictures were probably meant to recall initiation rites"
        },
        {
          "start": 84.84,
          "end": 87.47,
          "text": "or ritual hunts."
        }
      ]
    }
  },
  {
    "id": "terra-x-angkor-zentrum-des-konigreichs-der-khmer-cc-by-sa-4",
    "title": {
      "zh": "吴哥：高棉王国的中心",
      "de": "Angkor - Zentrum des Königreichs der Khmer",
      "en": "Angkor, Heart of the Khmer Kingdom"
    },
    "file": "terra-x/angkor-zentrum-des-konigreichs-der-khmer-cc-by-sa-4-0.mp4",
    "duration": 62.3,
    "credit": "ZDF/Terra X · CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Angkor_-_Zentrum_des_K%C3%B6nigreichs_der_Khmer_(CC_BY-SA_4.0).webm",
    "subtitles": {
      "zh": [
        {
          "start": 0.76,
          "end": 2.47,
          "text": "在柬埔寨，"
        },
        {
          "start": 2.5,
          "end": 5.05,
          "text": "有吴哥壮观的寺庙遗迹。"
        },
        {
          "start": 5.25,
          "end": 10.3,
          "text": "从 1992 年起，这片巨大的建筑群被列为联合国教科文组织世界文化遗产。"
        },
        {
          "start": 10.45,
          "end": 13.8,
          "text": "几百年前，这里是什么样子？"
        },
        {
          "start": 16.76,
          "end": 18.67,
          "text": "在丛林吞没一切之前，"
        },
        {
          "start": 18.72,
          "end": 22.25,
          "text": "高棉人从 9 世纪到 15 世纪统治着这里。"
        },
        {
          "start": 23.0,
          "end": 26.49,
          "text": "这片区域面积超过 400 平方公里。"
        },
        {
          "start": 27.0,
          "end": 28.97,
          "text": "这里曾是一座热闹的大都市，"
        },
        {
          "start": 29.02,
          "end": 32.78,
          "text": "一个住着几十万人的人口密集区。"
        },
        {
          "start": 34.94,
          "end": 37.83,
          "text": "只有寺庙区是用石头建的。"
        },
        {
          "start": 38.24,
          "end": 42.2,
          "text": "人们——连国王也一样——都住在木头房子里。"
        },
        {
          "start": 42.5,
          "end": 43.98,
          "text": "这也就是为什么"
        },
        {
          "start": 44.0,
          "end": 47.35,
          "text": "只有寺庙熬过了几百年。"
        },
        {
          "start": 48.52,
          "end": 50.35,
          "text": "吴哥被称为水城。"
        },
        {
          "start": 51.0,
          "end": 55.22,
          "text": "一套精巧的运河和水库系统"
        },
        {
          "start": 55.26,
          "end": 56.93,
          "text": "贯穿整片区域。"
        }
      ],
      "de": [
        {
          "start": 0.76,
          "end": 2.47,
          "text": "In Kambodscha befinden sich"
        },
        {
          "start": 2.5,
          "end": 5.05,
          "text": "die eindrucksvollen Tempelruinen von Angkor."
        },
        {
          "start": 5.25,
          "end": 10.3,
          "text": "Seit 1992 zählt die riesige Anlage zum UNESCO-Weltkulturerbe."
        },
        {
          "start": 10.45,
          "end": 13.8,
          "text": "Wie sah es hier vor vielen hundert Jahren aus?"
        },
        {
          "start": 16.76,
          "end": 18.67,
          "text": "Bevor der Dschungel alles verschlang,"
        },
        {
          "start": 18.72,
          "end": 22.25,
          "text": "herrschten hier die Khmer vom 9. bis 15. Jahrhundert."
        },
        {
          "start": 23.0,
          "end": 26.49,
          "text": "Mehr als 400 Quadratkilometer umfasst das Gelände."
        },
        {
          "start": 27.0,
          "end": 28.97,
          "text": "Hier lag eine quirlige Metropole,"
        },
        {
          "start": 29.02,
          "end": 32.78,
          "text": "ein Ballungsgebiet, in dem mehrere hunderttausend Menschen wohnten."
        },
        {
          "start": 34.94,
          "end": 37.83,
          "text": "Nur der Tempelbezirk war aus Stein erbaut."
        },
        {
          "start": 38.24,
          "end": 42.2,
          "text": "Die Menschen – auch der König – lebten in Häusern aus Holz."
        },
        {
          "start": 42.5,
          "end": 43.98,
          "text": "Das ist auch der Grund,"
        },
        {
          "start": 44.0,
          "end": 47.35,
          "text": "warum nur die Tempelanlagen die Jahrhunderte überstanden haben."
        },
        {
          "start": 48.52,
          "end": 50.35,
          "text": "Angkor gilt als Wasserstadt."
        },
        {
          "start": 51.0,
          "end": 55.22,
          "text": "Ein ausgeklügeltes System von Kanälen und Reservoirs"
        },
        {
          "start": 55.26,
          "end": 56.93,
          "text": "durchzieht das Gebiet."
        }
      ],
      "en": [
        {
          "start": 0.76,
          "end": 2.47,
          "text": "In Cambodia"
        },
        {
          "start": 2.5,
          "end": 5.05,
          "text": "lie the impressive temple ruins of Angkor."
        },
        {
          "start": 5.25,
          "end": 10.3,
          "text": "Since 1992 the huge complex has been a UNESCO World Heritage Site."
        },
        {
          "start": 10.45,
          "end": 13.8,
          "text": "What did it look like here many hundreds of years ago?"
        },
        {
          "start": 16.76,
          "end": 18.67,
          "text": "Before the jungle swallowed everything,"
        },
        {
          "start": 18.72,
          "end": 22.25,
          "text": "the Khmer ruled here from the 9th to the 15th century."
        },
        {
          "start": 23.0,
          "end": 26.49,
          "text": "The site covers more than 400 square kilometres."
        },
        {
          "start": 27.0,
          "end": 28.97,
          "text": "A bustling metropolis stood here,"
        },
        {
          "start": 29.02,
          "end": 32.78,
          "text": "a conurbation where several hundred thousand people lived."
        },
        {
          "start": 34.94,
          "end": 37.83,
          "text": "Only the temple district was built of stone."
        },
        {
          "start": 38.24,
          "end": 42.2,
          "text": "The people – the king included – lived in wooden houses."
        },
        {
          "start": 42.5,
          "end": 43.98,
          "text": "That is also the reason"
        },
        {
          "start": 44.0,
          "end": 47.35,
          "text": "why only the temples have survived the centuries."
        },
        {
          "start": 48.52,
          "end": 50.35,
          "text": "Angkor is considered a water city."
        },
        {
          "start": 51.0,
          "end": 55.22,
          "text": "An ingenious system of canals and reservoirs"
        },
        {
          "start": 55.26,
          "end": 56.93,
          "text": "runs through the area."
        }
      ]
    }
  },
  {
    "id": "terra-x-antriebseffekte-beim-segeln",
    "title": {
      "zh": "帆船靠什么前进",
      "de": "Antriebseffekte beim Segeln",
      "en": "What Drives a Sailboat"
    },
    "file": "terra-x/antriebseffekte-beim-segeln.mp4",
    "duration": 66.7,
    "credit": "ZDF/Pur+ · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Antriebseffekte_beim_Segeln.webm",
    "subtitles": {
      "zh": [
        {
          "start": 2.94,
          "end": 5.86,
          "text": "帆船利用两种推进效应："
        },
        {
          "start": 6.06,
          "end": 9.88,
          "text": "阻力和升力，而且是两者结合。"
        },
        {
          "start": 10.54,
          "end": 13.55,
          "text": "一种是直接作用在帆上的风压。"
        },
        {
          "start": 13.78,
          "end": 16.55,
          "text": "风从后面吹向横着的帆时，"
        },
        {
          "start": 16.59,
          "end": 20.68,
          "text": "推动力来自帆对风的阻力。"
        },
        {
          "start": 20.86,
          "end": 23.09,
          "text": "这里起作用的是阻力原理。"
        },
        {
          "start": 23.47,
          "end": 26.75,
          "text": "第二种效应是帆周围的气流，"
        },
        {
          "start": 26.77,
          "end": 28.55,
          "text": "它推着船往前走。"
        },
        {
          "start": 28.58,
          "end": 33.03,
          "text": "风经过弯曲的帆时，在鼓起的一侧流得更快，"
        },
        {
          "start": 33.06,
          "end": 34.93,
          "text": "在凹进去的内侧流得更慢。"
        },
        {
          "start": 35.28,
          "end": 40.23,
          "text": "于是在凹进去、背风的这一侧形成高压。"
        },
        {
          "start": 40.38,
          "end": 43.45,
          "text": "鼓起的一侧则形成低压和吸力。"
        },
        {
          "start": 43.5,
          "end": 46.79,
          "text": "两者合成一股力，朝同一个方向作用，"
        },
        {
          "start": 46.81,
          "end": 48.78,
          "text": "这就是升力。"
        },
        {
          "start": 50.49,
          "end": 53.2,
          "text": "因为升力垂直于帆面向外，"
        },
        {
          "start": 53.24,
          "end": 56.26,
          "text": "会让船过多地向侧面漂移。"
        },
        {
          "start": 56.35,
          "end": 59.55,
          "text": "为了防止这种情况，帆船装有稳向板。"
        },
        {
          "start": 59.69,
          "end": 62.8,
          "text": "它抵挡住向侧面的漂移，"
        },
        {
          "start": 62.87,
          "end": 66.28,
          "text": "所以总的来说，船就向前走了。"
        }
      ],
      "de": [
        {
          "start": 2.94,
          "end": 5.86,
          "text": "Beim Segeln werden zwei Antriebseffekte genutzt:"
        },
        {
          "start": 6.06,
          "end": 9.88,
          "text": "Widerstand und Auftrieb und zwar in Kombination."
        },
        {
          "start": 10.54,
          "end": 13.55,
          "text": "Einmal ist es der Winddruck, der direkt auf das Segel wirkt."
        },
        {
          "start": 13.78,
          "end": 16.55,
          "text": "Drückt der Wind von hinten auf das quergestellte Segel,"
        },
        {
          "start": 16.59,
          "end": 20.68,
          "text": "erfolgt der Antrieb durch den Widerstand, den das Segel dem Wind entgegensetzt."
        },
        {
          "start": 20.86,
          "end": 23.09,
          "text": "Hier wirkt das Widerstandsprinzip."
        },
        {
          "start": 23.47,
          "end": 26.75,
          "text": "Beim zweiten Effekt ist es die Luftströmung um das Segel,"
        },
        {
          "start": 26.77,
          "end": 28.55,
          "text": "die das Boot vorantreibt."
        },
        {
          "start": 28.58,
          "end": 33.03,
          "text": "Der Wind strömt bei dem gewölbten Segel auf der bauchigen Seite schneller vorbei"
        },
        {
          "start": 33.06,
          "end": 34.93,
          "text": "als auf der hohlen Innenseite."
        },
        {
          "start": 35.28,
          "end": 40.23,
          "text": "Dadurch entsteht an dieser hohlen, dem Wind abgewandten Seite ein Überdruck."
        },
        {
          "start": 40.38,
          "end": 43.45,
          "text": "An der bauchigen Seite dagegen ein Unterdruck und Sog."
        },
        {
          "start": 43.5,
          "end": 46.79,
          "text": "Beide wirken als Gesamtkraft in die gleiche Richtung"
        },
        {
          "start": 46.81,
          "end": 48.78,
          "text": "als Auftriebskraft."
        },
        {
          "start": 50.49,
          "end": 53.2,
          "text": "Da diese senkrecht vom Segel weg wirkt,"
        },
        {
          "start": 53.24,
          "end": 56.26,
          "text": "lässt sie das Boot seitlich zu sehr abtreiben."
        },
        {
          "start": 56.35,
          "end": 59.55,
          "text": "Damit das nicht passiert, haben Segelboote ein Schwert."
        },
        {
          "start": 59.69,
          "end": 62.8,
          "text": "Dieses stellt sich dem seitlichen Abtreiben entgegen,"
        },
        {
          "start": 62.87,
          "end": 66.28,
          "text": "so dass sich insgesamt eine Bewegung nach vorne ergibt."
        }
      ],
      "en": [
        {
          "start": 2.94,
          "end": 5.86,
          "text": "Sailing uses two propulsion effects:"
        },
        {
          "start": 6.06,
          "end": 9.88,
          "text": "drag and lift, in combination."
        },
        {
          "start": 10.54,
          "end": 13.55,
          "text": "One is the wind pressure acting directly on the sail."
        },
        {
          "start": 13.78,
          "end": 16.55,
          "text": "When the wind pushes from behind on a sail set across the boat,"
        },
        {
          "start": 16.59,
          "end": 20.68,
          "text": "the drive comes from the resistance the sail puts up against the wind."
        },
        {
          "start": 20.86,
          "end": 23.09,
          "text": "This is the drag principle at work."
        },
        {
          "start": 23.47,
          "end": 26.75,
          "text": "With the second effect it is the airflow around the sail"
        },
        {
          "start": 26.77,
          "end": 28.55,
          "text": "that drives the boat forward."
        },
        {
          "start": 28.58,
          "end": 33.03,
          "text": "On a curved sail the wind flows past the bulging side faster"
        },
        {
          "start": 33.06,
          "end": 34.93,
          "text": "than past the hollow inside."
        },
        {
          "start": 35.28,
          "end": 40.23,
          "text": "This creates higher pressure on the hollow, leeward side."
        },
        {
          "start": 40.38,
          "end": 43.45,
          "text": "On the bulging side, by contrast, low pressure and suction."
        },
        {
          "start": 43.5,
          "end": 46.79,
          "text": "Both act together as one force in the same direction:"
        },
        {
          "start": 46.81,
          "end": 48.78,
          "text": "as lift."
        },
        {
          "start": 50.49,
          "end": 53.2,
          "text": "Since this acts at right angles away from the sail,"
        },
        {
          "start": 53.24,
          "end": 56.26,
          "text": "it would push the boat too far sideways."
        },
        {
          "start": 56.35,
          "end": 59.55,
          "text": "To prevent that, sailboats have a centreboard."
        },
        {
          "start": 59.69,
          "end": 62.8,
          "text": "It resists the sideways drift,"
        },
        {
          "start": 62.87,
          "end": 66.28,
          "text": "so that overall the boat moves forward."
        }
      ]
    }
  },
  {
    "id": "terra-x-bedrohte-lowenpopulationen",
    "title": {
      "zh": "濒危的狮子种群",
      "de": "Bedrohte Löwenpopulationen",
      "en": "Lion Populations Under Threat"
    },
    "file": "terra-x/bedrohte-lowenpopulationen.mp4",
    "duration": 114.7,
    "credit": "ZDF/Tango Film, Pelorus Jack Filmprods LLC · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Bedrohte_L%C3%B6wenpopulationen.webm",
    "subtitles": {
      "zh": [
        {
          "start": 2.78,
          "end": 6.25,
          "text": "狮群在它们的栖息地里起着重要作用，"
        },
        {
          "start": 6.28,
          "end": 8.06,
          "text": "维持着生态平衡。"
        },
        {
          "start": 8.08,
          "end": 9.65,
          "text": "一向如此。"
        },
        {
          "start": 15.28,
          "end": 19.3,
          "text": "大约两百万年前，狮子出现在东非。"
        },
        {
          "start": 20.08,
          "end": 25.21,
          "text": "它们从那里占领了整个大陆，还一直扩散到欧洲。"
        },
        {
          "start": 27.14,
          "end": 30.27,
          "text": "史前的狮子没有鬃毛，"
        },
        {
          "start": 30.77,
          "end": 34.85,
          "text": "比今天的狮子大三分之一左右，而且非常成功："
        },
        {
          "start": 35.75,
          "end": 39.3,
          "text": "它们一直扩散到了美洲大陆。"
        },
        {
          "start": 41.9,
          "end": 44.5,
          "text": "在我们欧洲，冰河时期的狮子"
        },
        {
          "start": 44.53,
          "end": 47.68,
          "text": "大约一万一千年前数量还很多。"
        },
        {
          "start": 48.27,
          "end": 51.56,
          "text": "可是冰河时期结束时，它们的猎物灭绝了。"
        },
        {
          "start": 52.2,
          "end": 55.21,
          "text": "没有了食物来源，它们开始衰落。"
        },
        {
          "start": 56.37,
          "end": 58.3,
          "text": "人类也插了手。"
        },
        {
          "start": 58.83,
          "end": 62.31,
          "text": "狮子成了定居农民争夺食物的对手。"
        },
        {
          "start": 63.53,
          "end": 65.82,
          "text": "这种猛兽被无情地猎杀。"
        },
        {
          "start": 65.86,
          "end": 72.3,
          "text": "结果：大约两千年前，狮子在欧洲彻底灭绝。"
        },
        {
          "start": 73.8,
          "end": 77.79,
          "text": "全世界人口越来越多，需要的土地也越来越多。"
        },
        {
          "start": 77.9,
          "end": 80.31,
          "text": "枪支让狩猎变得高效。"
        },
        {
          "start": 80.47,
          "end": 84.17,
          "text": "20 世纪中叶，亚洲狮也消失了。"
        },
        {
          "start": 84.5,
          "end": 88.32,
          "text": "只有在印度，一个很小的种群活到了今天。"
        },
        {
          "start": 90.52,
          "end": 93.79,
          "text": "在非洲，狮子只剩下撒哈拉以南还有。"
        },
        {
          "start": 93.89,
          "end": 95.85,
          "text": "但它们也受到威胁。"
        },
        {
          "start": 96.13,
          "end": 100.34,
          "text": "西非和中非的情况特别严峻："
        },
        {
          "start": 100.77,
          "end": 104.86,
          "text": "那里只剩几百只，分散在彼此隔绝的残存种群里。"
        },
        {
          "start": 106.19,
          "end": 110.55,
          "text": "只有保护区还在阻止狮子灭绝。"
        }
      ],
      "de": [
        {
          "start": 2.78,
          "end": 6.25,
          "text": "Löwenfamilien spielen in ihren Lebensräumen eine wichtige Rolle"
        },
        {
          "start": 6.28,
          "end": 8.06,
          "text": "im ökologischen Gleichgewicht."
        },
        {
          "start": 8.08,
          "end": 9.65,
          "text": "Das war schon immer so."
        },
        {
          "start": 15.28,
          "end": 19.3,
          "text": "Vor rund zwei Millionen Jahren tauchte der Löwe in Ostafrika auf."
        },
        {
          "start": 20.08,
          "end": 25.21,
          "text": "Von dort eroberte er den Kontinent und breitete sich bis nach Europa aus."
        },
        {
          "start": 27.14,
          "end": 30.27,
          "text": "Die prähistorischen Raubkatzen waren mähnenlos,"
        },
        {
          "start": 30.77,
          "end": 34.85,
          "text": "rund ein Drittel größer als die heutigen Löwen und äußerst erfolgreich:"
        },
        {
          "start": 35.75,
          "end": 39.3,
          "text": "Sie verbreiteten sich bis zum amerikanischen Kontinent."
        },
        {
          "start": 41.9,
          "end": 44.5,
          "text": "Bei uns in Europa waren die eiszeitlichen Löwen"
        },
        {
          "start": 44.53,
          "end": 47.68,
          "text": "vor rund 11.000 Jahren noch zahlreich vertreten."
        },
        {
          "start": 48.27,
          "end": 51.56,
          "text": "Doch am Ende der Eiszeit starben ihre Beutetiere aus."
        },
        {
          "start": 52.2,
          "end": 55.21,
          "text": "Ohne Nahrungsgrundlage begann ihr Niedergang."
        },
        {
          "start": 56.37,
          "end": 58.3,
          "text": "Auch der Mensch griff ein."
        },
        {
          "start": 58.83,
          "end": 62.31,
          "text": "Löwen wurden zu Nahrungskonkurrenten von sesshaften Bauern."
        },
        {
          "start": 63.53,
          "end": 65.82,
          "text": "Die Raubkatze wurde gnadenlos bejagt."
        },
        {
          "start": 65.86,
          "end": 72.3,
          "text": "Die Folge: Vor circa 2000 Jahren starb der Löwe in Europa endgültig aus."
        },
        {
          "start": 73.8,
          "end": 77.79,
          "text": "Weltweit nahm die Zahl der Menschen zu, sie brauchten immer mehr Land."
        },
        {
          "start": 77.9,
          "end": 80.31,
          "text": "Schusswaffen machten die Jagd effizient."
        },
        {
          "start": 80.47,
          "end": 84.17,
          "text": "Mitte des 20. Jahrhunderts verschwand auch der asiatische Löwe."
        },
        {
          "start": 84.5,
          "end": 88.32,
          "text": "Lediglich in Indien hat bis heute eine sehr kleine Population überlebt."
        },
        {
          "start": 90.52,
          "end": 93.79,
          "text": "In Afrika kommen Löwen nur noch südlich der Sahara vor."
        },
        {
          "start": 93.89,
          "end": 95.85,
          "text": "Doch auch sie sind bedroht."
        },
        {
          "start": 96.13,
          "end": 100.34,
          "text": "Besonders kritisch ist die Situation in West- und Zentralafrika:"
        },
        {
          "start": 100.77,
          "end": 104.86,
          "text": "Hier leben nur noch wenige hundert Tiere in isolierten Restpopulationen."
        },
        {
          "start": 106.19,
          "end": 110.55,
          "text": "Nur Schutzgebiete verhindern noch das Aussterben von Löwen."
        }
      ],
      "en": [
        {
          "start": 2.78,
          "end": 6.25,
          "text": "Lion families play an important role in their habitats"
        },
        {
          "start": 6.28,
          "end": 8.06,
          "text": "in keeping the ecological balance."
        },
        {
          "start": 8.08,
          "end": 9.65,
          "text": "It has always been that way."
        },
        {
          "start": 15.28,
          "end": 19.3,
          "text": "About two million years ago the lion appeared in East Africa."
        },
        {
          "start": 20.08,
          "end": 25.21,
          "text": "From there it conquered the continent and spread as far as Europe."
        },
        {
          "start": 27.14,
          "end": 30.27,
          "text": "The prehistoric big cats had no mane,"
        },
        {
          "start": 30.77,
          "end": 34.85,
          "text": "were about a third bigger than today's lions and extremely successful:"
        },
        {
          "start": 35.75,
          "end": 39.3,
          "text": "they spread all the way to the American continent."
        },
        {
          "start": 41.9,
          "end": 44.5,
          "text": "Here in Europe, Ice Age lions"
        },
        {
          "start": 44.53,
          "end": 47.68,
          "text": "were still numerous about 11,000 years ago."
        },
        {
          "start": 48.27,
          "end": 51.56,
          "text": "But at the end of the Ice Age their prey died out."
        },
        {
          "start": 52.2,
          "end": 55.21,
          "text": "Without a food supply their decline began."
        },
        {
          "start": 56.37,
          "end": 58.3,
          "text": "Humans stepped in too."
        },
        {
          "start": 58.83,
          "end": 62.31,
          "text": "Lions became food competitors of settled farmers."
        },
        {
          "start": 63.53,
          "end": 65.82,
          "text": "The big cat was hunted mercilessly."
        },
        {
          "start": 65.86,
          "end": 72.3,
          "text": "The result: about 2,000 years ago the lion finally died out in Europe."
        },
        {
          "start": 73.8,
          "end": 77.79,
          "text": "Worldwide the human population grew and needed more and more land."
        },
        {
          "start": 77.9,
          "end": 80.31,
          "text": "Firearms made hunting efficient."
        },
        {
          "start": 80.47,
          "end": 84.17,
          "text": "In the mid-20th century the Asiatic lion vanished too."
        },
        {
          "start": 84.5,
          "end": 88.32,
          "text": "Only in India has a very small population survived to this day."
        },
        {
          "start": 90.52,
          "end": 93.79,
          "text": "In Africa lions are now found only south of the Sahara."
        },
        {
          "start": 93.89,
          "end": 95.85,
          "text": "But they are threatened as well."
        },
        {
          "start": 96.13,
          "end": 100.34,
          "text": "The situation is especially critical in West and Central Africa:"
        },
        {
          "start": 100.77,
          "end": 104.86,
          "text": "only a few hundred animals live there in isolated remnant populations."
        },
        {
          "start": 106.19,
          "end": 110.55,
          "text": "Only protected areas are still preventing the lions from dying out."
        }
      ]
    }
  },
  {
    "id": "terra-x-bedrohtes-okosystem-fluss",
    "title": {
      "zh": "受威胁的河流生态",
      "de": "Bedrohtes Ökosystem Fluss",
      "en": "Rivers: An Ecosystem Under Threat"
    },
    "file": "terra-x/bedrohtes-okosystem-fluss.mp4",
    "duration": 74.5,
    "credit": "ZDF/logo · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Bedrohtes_%C3%96kosystem_Fluss.webm",
    "subtitles": {
      "zh": [
        {
          "start": 0.55,
          "end": 4.17,
          "text": "在德国，农田和草地常常一直延伸到河边。"
        },
        {
          "start": 4.24,
          "end": 7.01,
          "text": "比如农民用粪肥给田地施肥，"
        },
        {
          "start": 7.04,
          "end": 10.98,
          "text": "也就是额外补充养分时，其中一部分也会流进河里。"
        },
        {
          "start": 11.49,
          "end": 14.41,
          "text": "这样河里的藻类就会大量繁殖，"
        },
        {
          "start": 14.44,
          "end": 16.23,
          "text": "而藻类会消耗很多氧气。"
        },
        {
          "start": 16.81,
          "end": 20.48,
          "text": "可是河里的动物和植物需要氧气才能活下去。"
        },
        {
          "start": 20.7,
          "end": 23.54,
          "text": "另一个问题是，德国很多河流"
        },
        {
          "start": 23.55,
          "end": 26.25,
          "text": "被改成笔直的河道，也就是被截弯取直，"
        },
        {
          "start": 26.28,
          "end": 28.64,
          "text": "好让船开得更顺。"
        },
        {
          "start": 29.04,
          "end": 32.07,
          "text": "可如果一条河没有弯道或者弯道变少，"
        },
        {
          "start": 32.11,
          "end": 33.52,
          "text": "水就流得更快。"
        },
        {
          "start": 33.83,
          "end": 37.08,
          "text": "能让鱼产卵的平静水域少了，"
        },
        {
          "start": 37.14,
          "end": 40.5,
          "text": "青蛙之类的动物也难找到藏身处和家。"
        },
        {
          "start": 41.29,
          "end": 42.81,
          "text": "还有船闸和水坝，"
        },
        {
          "start": 42.86,
          "end": 45.79,
          "text": "也会威胁动植物的生存空间。"
        },
        {
          "start": 46.0,
          "end": 49.8,
          "text": "它们把水拦住，于是比如很多鱼"
        },
        {
          "start": 49.84,
          "end": 52.21,
          "text": "就没法在河里来回游动，"
        },
        {
          "start": 52.26,
          "end": 55.23,
          "text": "去找食物或者繁殖。"
        },
        {
          "start": 56.91,
          "end": 58.12,
          "text": "所以说："
        },
        {
          "start": 58.15,
          "end": 59.76,
          "text": "水里粪肥太多，"
        },
        {
          "start": 59.8,
          "end": 61.23,
          "text": "河道被截弯取直，"
        },
        {
          "start": 61.27,
          "end": 62.42,
          "text": "还有船闸——"
        },
        {
          "start": 62.62,
          "end": 64.24,
          "text": "这就是三个原因，"
        },
        {
          "start": 64.28,
          "end": 68.34,
          "text": "说明为什么河里许多动植物的生存空间受到了威胁。"
        }
      ],
      "de": [
        {
          "start": 0.55,
          "end": 4.17,
          "text": "In Deutschland reichen Äcker und Wiesen oft direkt an viele Flüsse heran."
        },
        {
          "start": 4.24,
          "end": 7.01,
          "text": "Wenn die Bauern ihre Felder zum Beispiel mit Gülle düngen,"
        },
        {
          "start": 7.04,
          "end": 10.98,
          "text": "also mit extra Nährstoffen versorgen, gelangt auch etwas davon in die Flüsse."
        },
        {
          "start": 11.49,
          "end": 14.41,
          "text": "Dadurch können sich in den Flüssen Algen stark vermehren,"
        },
        {
          "start": 14.44,
          "end": 16.23,
          "text": "und die verbrauchen viel Sauerstoff."
        },
        {
          "start": 16.81,
          "end": 20.48,
          "text": "Die Tiere und Pflanzen im Fluss brauchen aber Sauerstoff, um zu überleben."
        },
        {
          "start": 20.7,
          "end": 23.54,
          "text": "Ein weiteres Problem ist, dass viele Flüsse in Deutschland"
        },
        {
          "start": 23.55,
          "end": 26.25,
          "text": "in gerade Bahnen gelenkt, also begradigt, werden,"
        },
        {
          "start": 26.28,
          "end": 28.64,
          "text": "damit die Schiffe besser darauf fahren können."
        },
        {
          "start": 29.04,
          "end": 32.07,
          "text": "Wenn ein Fluss aber keine oder weniger Kurven hat,"
        },
        {
          "start": 32.11,
          "end": 33.52,
          "text": "fließt das Wasser schneller."
        },
        {
          "start": 33.83,
          "end": 37.08,
          "text": "Es gibt weniger ruhige Stellen, an denen Fische ihre Eier ablegen"
        },
        {
          "start": 37.14,
          "end": 40.5,
          "text": "und Tiere wie Frösche Verstecke und ein Zuhause finden können."
        },
        {
          "start": 41.29,
          "end": 42.81,
          "text": "Und auch Schleusen und Wehre"
        },
        {
          "start": 42.86,
          "end": 45.79,
          "text": "können den Lebensraum von Pflanzen und Tieren bedrohen."
        },
        {
          "start": 46.0,
          "end": 49.8,
          "text": "Sie stauen das Wasser auf, und so können zum Beispiel viele Fische"
        },
        {
          "start": 49.84,
          "end": 52.21,
          "text": "nicht mehr innerhalb des Flusses umherschwimmen,"
        },
        {
          "start": 52.26,
          "end": 55.23,
          "text": "um Nahrung zu suchen oder sich fortzupflanzen."
        },
        {
          "start": 56.91,
          "end": 58.12,
          "text": "Also:"
        },
        {
          "start": 58.15,
          "end": 59.76,
          "text": "Zuviel Gülle im Wasser,"
        },
        {
          "start": 59.8,
          "end": 61.23,
          "text": "begradigte Flüsse"
        },
        {
          "start": 61.27,
          "end": 62.42,
          "text": "und Schleusen –"
        },
        {
          "start": 62.62,
          "end": 64.24,
          "text": "das sind drei Gründe,"
        },
        {
          "start": 64.28,
          "end": 68.34,
          "text": "warum der Lebensraum vieler Tiere und Pflanzen in Flüssen bedroht ist."
        }
      ],
      "en": [
        {
          "start": 0.55,
          "end": 4.17,
          "text": "In Germany fields and meadows often reach right down to many rivers."
        },
        {
          "start": 4.24,
          "end": 7.01,
          "text": "When farmers fertilise their fields with liquid manure, for example,"
        },
        {
          "start": 7.04,
          "end": 10.98,
          "text": "giving them extra nutrients, some of it ends up in the rivers too."
        },
        {
          "start": 11.49,
          "end": 14.41,
          "text": "That lets algae multiply strongly in the rivers,"
        },
        {
          "start": 14.44,
          "end": 16.23,
          "text": "and they use up a lot of oxygen."
        },
        {
          "start": 16.81,
          "end": 20.48,
          "text": "But the animals and plants in the river need oxygen to survive."
        },
        {
          "start": 20.7,
          "end": 23.54,
          "text": "Another problem is that many rivers in Germany"
        },
        {
          "start": 23.55,
          "end": 26.25,
          "text": "are forced into straight channels, that is, straightened,"
        },
        {
          "start": 26.28,
          "end": 28.64,
          "text": "so that ships can travel on them more easily."
        },
        {
          "start": 29.04,
          "end": 32.07,
          "text": "But when a river has no bends, or fewer,"
        },
        {
          "start": 32.11,
          "end": 33.52,
          "text": "the water flows faster."
        },
        {
          "start": 33.83,
          "end": 37.08,
          "text": "There are fewer quiet spots where fish can lay their eggs"
        },
        {
          "start": 37.14,
          "end": 40.5,
          "text": "and where animals like frogs can find hiding places and a home."
        },
        {
          "start": 41.29,
          "end": 42.81,
          "text": "Locks and weirs, too,"
        },
        {
          "start": 42.86,
          "end": 45.79,
          "text": "can threaten the habitat of plants and animals."
        },
        {
          "start": 46.0,
          "end": 49.8,
          "text": "They dam up the water, so that many fish, for example,"
        },
        {
          "start": 49.84,
          "end": 52.21,
          "text": "can no longer swim around within the river"
        },
        {
          "start": 52.26,
          "end": 55.23,
          "text": "to look for food or to breed."
        },
        {
          "start": 56.91,
          "end": 58.12,
          "text": "So:"
        },
        {
          "start": 58.15,
          "end": 59.76,
          "text": "too much manure in the water,"
        },
        {
          "start": 59.8,
          "end": 61.23,
          "text": "straightened rivers"
        },
        {
          "start": 61.27,
          "end": 62.42,
          "text": "and locks –"
        },
        {
          "start": 62.62,
          "end": 64.24,
          "text": "those are three reasons"
        },
        {
          "start": 64.28,
          "end": 68.34,
          "text": "why the habitat of many animals and plants in rivers is under threat."
        }
      ]
    }
  },
  {
    "id": "terra-x-artensterben-im-wandel-der-zeit",
    "title": {
      "zh": "历史上的物种大灭绝",
      "de": "Artensterben im Wandel der Zeit",
      "en": "Mass Extinctions Through Time"
    },
    "file": "terra-x/artensterben-im-wandel-der-zeit.mp4",
    "duration": 132.7,
    "credit": "3sat/nano · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Artensterben_im_Wandel_der_Zeit.webm",
    "subtitles": {
      "zh": [
        {
          "start": 1.34,
          "end": 3.5,
          "text": "在过去五亿年里，"
        },
        {
          "start": 3.53,
          "end": 7.3,
          "text": "地球上的生物多样性一直在变化。"
        },
        {
          "start": 7.31,
          "end": 11.79,
          "text": "就像一条体温曲线，有时往上走，有几次急剧下跌。"
        },
        {
          "start": 11.86,
          "end": 16.94,
          "text": "这些向下的异常被称为五次大灭绝。"
        },
        {
          "start": 17.95,
          "end": 23.15,
          "text": "第一次大灭绝发生在 4.44 亿年前。"
        },
        {
          "start": 23.29,
          "end": 25.51,
          "text": "起因是一次冰期，"
        },
        {
          "start": 25.54,
          "end": 30.58,
          "text": "当时几乎都生活在海里的物种有 85% 灭绝了。"
        },
        {
          "start": 32.3,
          "end": 35.75,
          "text": "第二次大灭绝持续时间更长，"
        },
        {
          "start": 35.78,
          "end": 38.14,
          "text": "发生在大约 3.7 亿年前，"
        },
        {
          "start": 38.16,
          "end": 40.76,
          "text": "将近四分之三的物种消失了。"
        },
        {
          "start": 41.01,
          "end": 43.98,
          "text": "主要是珊瑚和鱼类，比如巨大的"
        },
        {
          "start": 44.02,
          "end": 46.42,
          "text": "长达十米的盾皮鱼。"
        },
        {
          "start": 46.79,
          "end": 51.49,
          "text": "下一场灾难发生在 2.52 亿年前。"
        },
        {
          "start": 51.76,
          "end": 53.09,
          "text": "这次的起因是："
        },
        {
          "start": 53.12,
          "end": 57.26,
          "text": "西伯利亚剧烈火山喷发造成的气候变化。"
        },
        {
          "start": 57.47,
          "end": 60.73,
          "text": "遇难的有四分之三的陆地动物物种，"
        },
        {
          "start": 60.76,
          "end": 65.75,
          "text": "其中包括许多昆虫，还有 95% 的海洋生物——"
        },
        {
          "start": 65.77,
          "end": 68.51,
          "text": "比如巨大的海蝎。"
        },
        {
          "start": 68.82,
          "end": 72.45,
          "text": "板块移动引发的剧烈火山活动"
        },
        {
          "start": 72.49,
          "end": 77.3,
          "text": "在 2.01 亿年前造成了第四次大灭绝。"
        },
        {
          "start": 77.48,
          "end": 80.78,
          "text": "这一次，物种减少了 70%。"
        },
        {
          "start": 80.88,
          "end": 84.85,
          "text": "受害者包括牙形动物，也叫锥齿动物。"
        },
        {
          "start": 84.88,
          "end": 89.93,
          "text": "这种像鳗鱼一样的生物曾经有 3000 多个物种。"
        },
        {
          "start": 90.77,
          "end": 96.79,
          "text": "研究得最透彻的是 6600 万年前的第五次大灭绝。"
        },
        {
          "start": 98.8,
          "end": 100.78,
          "text": "可能的主要原因"
        },
        {
          "start": 100.81,
          "end": 104.63,
          "text": "被确认为一颗直径超过十公里的小行星，"
        },
        {
          "start": 104.67,
          "end": 107.55,
          "text": "它撞在了墨西哥的尤卡坦。"
        },
        {
          "start": 108.75,
          "end": 111.22,
          "text": "这次最有名的遇难者："
        },
        {
          "start": 111.26,
          "end": 112.53,
          "text": "恐龙。"
        },
        {
          "start": 117.43,
          "end": 121.06,
          "text": "第六次大灭绝是我们人类造成的，"
        },
        {
          "start": 121.13,
          "end": 123.98,
          "text": "我们把生物圈改变得太厉害，"
        },
        {
          "start": 124.01,
          "end": 128.82,
          "text": "以至于世界每年都会失去几千种动植物。"
        }
      ],
      "de": [
        {
          "start": 1.34,
          "end": 3.5,
          "text": "In den letzten 500 Millionen Jahren"
        },
        {
          "start": 3.53,
          "end": 7.3,
          "text": "hat sich die biologische Vielfalt auf der Erde ständig verändert."
        },
        {
          "start": 7.31,
          "end": 11.79,
          "text": "Wie bei einer Fieberkurve ging es dabei aufwärts und einige Male steil bergab."
        },
        {
          "start": 11.86,
          "end": 16.94,
          "text": "Diese Ausreißer nach unten werden als die fünf großen Massensterben beschrieben."
        },
        {
          "start": 17.95,
          "end": 23.15,
          "text": "Das erste große Massensterben fand vor 444 Millionen Jahren statt."
        },
        {
          "start": 23.29,
          "end": 25.51,
          "text": "Eine Eiszeit war die Ursache dafür,"
        },
        {
          "start": 25.54,
          "end": 30.58,
          "text": "dass 85 Prozent der damals fast nur im Meer lebenden Arten ausstarben."
        },
        {
          "start": 32.3,
          "end": 35.75,
          "text": "Beim zweiten großen - länger andauernden - Massensterben,"
        },
        {
          "start": 35.78,
          "end": 38.14,
          "text": "vor rund 370 Millionen Jahren,"
        },
        {
          "start": 38.16,
          "end": 40.76,
          "text": "verschwanden fast drei Viertel aller Arten."
        },
        {
          "start": 41.01,
          "end": 43.98,
          "text": "Hauptsächlich Korallen und Fische, wie die gewaltigen,"
        },
        {
          "start": 44.02,
          "end": 46.42,
          "text": "bis zu zehn Meter langen Panzerfische."
        },
        {
          "start": 46.79,
          "end": 51.49,
          "text": "Die nächste Katastrophe ereignete sich vor 252 Millionen Jahren."
        },
        {
          "start": 51.76,
          "end": 53.09,
          "text": "Auslöser diesmal:"
        },
        {
          "start": 53.12,
          "end": 57.26,
          "text": "Klimaveränderungen durch gewaltige Vulkanausbrüche in Sibirien."
        },
        {
          "start": 57.47,
          "end": 60.73,
          "text": "Zu den Opfern gehörten drei Viertel aller Landtierarten,"
        },
        {
          "start": 60.76,
          "end": 65.75,
          "text": "darunter auch viele Insektenarten und 95 Prozent aller Meeresbewohner –"
        },
        {
          "start": 65.77,
          "end": 68.51,
          "text": "wie etwa die riesigen Seeskorpione."
        },
        {
          "start": 68.82,
          "end": 72.45,
          "text": "Gewaltiger Vulkanismus durch die Verschiebung von Erdplatten"
        },
        {
          "start": 72.49,
          "end": 77.3,
          "text": "verursachte vor 201 Millionen Jahren das vierte Massensterben."
        },
        {
          "start": 77.48,
          "end": 80.78,
          "text": "Diesmal betrug der Artenschwund 70 Prozent."
        },
        {
          "start": 80.88,
          "end": 84.85,
          "text": "Betroffen waren unter anderem die Conodonten oder Kegelzähner."
        },
        {
          "start": 84.88,
          "end": 89.93,
          "text": "Von diesen aalähnlichen Geschöpfen gab es einst über 3000 Arten."
        },
        {
          "start": 90.77,
          "end": 96.79,
          "text": "Am besten erforscht ist das fünfte Aussterben vor 66 Millionen Jahren."
        },
        {
          "start": 98.8,
          "end": 100.78,
          "text": "Als mögliche Hauptursache"
        },
        {
          "start": 100.81,
          "end": 104.63,
          "text": "wurde ein über zehn Kilometer großer Asteroid identifiziert,"
        },
        {
          "start": 104.67,
          "end": 107.55,
          "text": "der im mexikanischen Yukatan einschlug."
        },
        {
          "start": 108.75,
          "end": 111.22,
          "text": "Prominenteste Opfer diesmal:"
        },
        {
          "start": 111.26,
          "end": 112.53,
          "text": "die Dinosaurier."
        },
        {
          "start": 117.43,
          "end": 121.06,
          "text": "Für das sechste Massensterben sorgen wir Menschen,"
        },
        {
          "start": 121.13,
          "end": 123.98,
          "text": "indem wir die Biosphäre derart verändern,"
        },
        {
          "start": 124.01,
          "end": 128.82,
          "text": "dass die Welt jährlich mehrere tausend Tier- und Pflanzenarten verliert."
        }
      ],
      "en": [
        {
          "start": 1.34,
          "end": 3.5,
          "text": "Over the past 500 million years"
        },
        {
          "start": 3.53,
          "end": 7.3,
          "text": "biodiversity on Earth has constantly changed."
        },
        {
          "start": 7.31,
          "end": 11.79,
          "text": "Like a fever chart it went up, and a few times steeply down."
        },
        {
          "start": 11.86,
          "end": 16.94,
          "text": "These downward outliers are described as the five great mass extinctions."
        },
        {
          "start": 17.95,
          "end": 23.15,
          "text": "The first great mass extinction took place 444 million years ago."
        },
        {
          "start": 23.29,
          "end": 25.51,
          "text": "An ice age was the reason"
        },
        {
          "start": 25.54,
          "end": 30.58,
          "text": "that 85 percent of the species of the time, living almost only in the sea, died out."
        },
        {
          "start": 32.3,
          "end": 35.75,
          "text": "In the second great, longer-lasting mass extinction,"
        },
        {
          "start": 35.78,
          "end": 38.14,
          "text": "around 370 million years ago,"
        },
        {
          "start": 38.16,
          "end": 40.76,
          "text": "almost three quarters of all species disappeared."
        },
        {
          "start": 41.01,
          "end": 43.98,
          "text": "Mainly corals and fish, such as the huge"
        },
        {
          "start": 44.02,
          "end": 46.42,
          "text": "armoured fish up to ten metres long."
        },
        {
          "start": 46.79,
          "end": 51.49,
          "text": "The next catastrophe happened 252 million years ago."
        },
        {
          "start": 51.76,
          "end": 53.09,
          "text": "The trigger this time:"
        },
        {
          "start": 53.12,
          "end": 57.26,
          "text": "climate change caused by massive volcanic eruptions in Siberia."
        },
        {
          "start": 57.47,
          "end": 60.73,
          "text": "The victims included three quarters of all land animal species,"
        },
        {
          "start": 60.76,
          "end": 65.75,
          "text": "among them many insect species, and 95 percent of all sea creatures –"
        },
        {
          "start": 65.77,
          "end": 68.51,
          "text": "such as the giant sea scorpions."
        },
        {
          "start": 68.82,
          "end": 72.45,
          "text": "Massive volcanism from the movement of tectonic plates"
        },
        {
          "start": 72.49,
          "end": 77.3,
          "text": "caused the fourth mass extinction 201 million years ago."
        },
        {
          "start": 77.48,
          "end": 80.78,
          "text": "This time species loss reached 70 percent."
        },
        {
          "start": 80.88,
          "end": 84.85,
          "text": "Among those affected were the conodonts."
        },
        {
          "start": 84.88,
          "end": 89.93,
          "text": "There were once more than 3,000 species of these eel-like creatures."
        },
        {
          "start": 90.77,
          "end": 96.79,
          "text": "The best researched is the fifth extinction 66 million years ago."
        },
        {
          "start": 98.8,
          "end": 100.78,
          "text": "As a likely main cause,"
        },
        {
          "start": 100.81,
          "end": 104.63,
          "text": "an asteroid more than ten kilometres across was identified"
        },
        {
          "start": 104.67,
          "end": 107.55,
          "text": "that struck Mexico's Yucatán."
        },
        {
          "start": 108.75,
          "end": 111.22,
          "text": "The most famous victims this time:"
        },
        {
          "start": 111.26,
          "end": 112.53,
          "text": "the dinosaurs."
        },
        {
          "start": 117.43,
          "end": 121.06,
          "text": "We humans are causing the sixth mass extinction,"
        },
        {
          "start": 121.13,
          "end": 123.98,
          "text": "by changing the biosphere so much"
        },
        {
          "start": 124.01,
          "end": 128.82,
          "text": "that the world loses several thousand animal and plant species every year."
        }
      ]
    }
  },
  {
    "id": "terra-x-braucht-der-mensch-fleisch",
    "title": {
      "zh": "人类需要吃肉吗",
      "de": "Braucht der Mensch Fleisch?",
      "en": "Do Humans Need Meat?"
    },
    "file": "terra-x/braucht-der-mensch-fleisch.mp4",
    "duration": 88.0,
    "credit": "3sat/nano · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Braucht_der_Mensch_Fleisch%3F.webm",
    "subtitles": {
      "zh": [
        {
          "start": 2.11,
          "end": 6.14,
          "text": "人类需要吃肉才能营养均衡吗？"
        },
        {
          "start": 7.05,
          "end": 9.93,
          "text": "我们的祖先，也就是早期和远古人类，"
        },
        {
          "start": 9.96,
          "end": 12.27,
          "text": "主要以水果为食。"
        },
        {
          "start": 12.48,
          "end": 16.79,
          "text": "他们能快速有效地消化植物性食物。"
        },
        {
          "start": 19.27,
          "end": 21.84,
          "text": "偶尔他们也吃肉。"
        },
        {
          "start": 22.73,
          "end": 26.29,
          "text": "肉对他们来说和植物一样好消化。"
        },
        {
          "start": 27.28,
          "end": 31.76,
          "text": "在进化过程中，摄入动物蛋白促进了生长——"
        },
        {
          "start": 31.78,
          "end": 33.24,
          "text": "大脑也一样。"
        },
        {
          "start": 33.57,
          "end": 36.73,
          "text": "认知能力是否因此提高，"
        },
        {
          "start": 36.79,
          "end": 39.18,
          "text": "科学界还有争议。"
        },
        {
          "start": 39.75,
          "end": 43.75,
          "text": "德国人每年大约吃 60 公斤肉！"
        },
        {
          "start": 43.95,
          "end": 47.99,
          "text": "批评者认为太多了：因为吃肉过量"
        },
        {
          "start": 48.05,
          "end": 51.8,
          "text": "有害健康，还可能致癌！"
        },
        {
          "start": 52.5,
          "end": 55.99,
          "text": "不过从营养学角度看，肉似乎又不可或缺："
        },
        {
          "start": 56.07,
          "end": 59.65,
          "text": "它含有蛋白质，还有铁、锌等矿物质，"
        },
        {
          "start": 59.68,
          "end": 62.52,
          "text": "以及丰富的硒和 B 族维生素。"
        },
        {
          "start": 63.08,
          "end": 65.79,
          "text": "但德国营养学会建议，"
        },
        {
          "start": 65.81,
          "end": 68.4,
          "text": "每周最多吃 600 克肉。"
        },
        {
          "start": 68.53,
          "end": 71.49,
          "text": "这样身体也能获得重要的维生素 B12，"
        },
        {
          "start": 71.54,
          "end": 73.93,
          "text": "而肉里的 B12 特别容易被吸收。"
        },
        {
          "start": 74.38,
          "end": 75.78,
          "text": "吃纯素的人"
        },
        {
          "start": 75.82,
          "end": 79.6,
          "text": "必须通过别的途径补充维生素 B12，"
        },
        {
          "start": 79.63,
          "end": 81.8,
          "text": "以防出现缺乏症状。"
        }
      ],
      "de": [
        {
          "start": 2.11,
          "end": 6.14,
          "text": "Brauchen wir Menschen Fleisch für eine ausgewogene Ernährung?"
        },
        {
          "start": 7.05,
          "end": 9.93,
          "text": "Unsere Vorfahren, die Vor- und Frühmenschen,"
        },
        {
          "start": 9.96,
          "end": 12.27,
          "text": "waren überwiegend Fruchtfresser."
        },
        {
          "start": 12.48,
          "end": 16.79,
          "text": "Sie konnten pflanzliche Nahrung schnell und effektiv verwerten."
        },
        {
          "start": 19.27,
          "end": 21.84,
          "text": "Gelegentlich aßen sie auch Fleisch."
        },
        {
          "start": 22.73,
          "end": 26.29,
          "text": "Das war für sie ebenso gut verdaulich wie Pflanzen."
        },
        {
          "start": 27.28,
          "end": 31.76,
          "text": "In der Evolution führte die Aufnahme von tierischem Protein zu Wachstum -"
        },
        {
          "start": 31.78,
          "end": 33.24,
          "text": "auch des Gehirns."
        },
        {
          "start": 33.57,
          "end": 36.73,
          "text": "Ob dadurch die kognitiven Fähigkeiten gestiegen sind,"
        },
        {
          "start": 36.79,
          "end": 39.18,
          "text": "ist in der Wissenschaft umstritten."
        },
        {
          "start": 39.75,
          "end": 43.75,
          "text": "Der Deutsche isst etwa 60 Kilogramm Fleisch pro Jahr!"
        },
        {
          "start": 43.95,
          "end": 47.99,
          "text": "Viel zu viel, finden Kritiker: Denn übermäßiger Fleischverzehr"
        },
        {
          "start": 48.05,
          "end": 51.8,
          "text": "ist ein Gesundheitsrisiko und kann Krebs verursachen!"
        },
        {
          "start": 52.5,
          "end": 55.99,
          "text": "Dabei erscheint Fleisch ernährungsphysiologisch unverzichtbar:"
        },
        {
          "start": 56.07,
          "end": 59.65,
          "text": "Es enthält Eiweiß, Mineralstoffe wie Eisen und Zink"
        },
        {
          "start": 59.68,
          "end": 62.52,
          "text": "sowie reichlich Selen und B Vitamine."
        },
        {
          "start": 63.08,
          "end": 65.79,
          "text": "Die Deutsche Gesellschaft für Ernährung empfiehlt aber,"
        },
        {
          "start": 65.81,
          "end": 68.4,
          "text": "maximal 600 Gramm Fleisch pro Woche zu essen."
        },
        {
          "start": 68.53,
          "end": 71.49,
          "text": "So erhält der Körper auch das wichtige Vitamin B 12,"
        },
        {
          "start": 71.54,
          "end": 73.93,
          "text": "das aus Fleisch besonders gut verwertbar ist."
        },
        {
          "start": 74.38,
          "end": 75.78,
          "text": "Wer sich vegan ernährt,"
        },
        {
          "start": 75.82,
          "end": 79.6,
          "text": "muss seine Versorgung mit Vitamin B12 alternativ ergänzen,"
        },
        {
          "start": 79.63,
          "end": 81.8,
          "text": "um Mangelerscheinungen vorzubeugen."
        }
      ],
      "en": [
        {
          "start": 2.11,
          "end": 6.14,
          "text": "Do we humans need meat for a balanced diet?"
        },
        {
          "start": 7.05,
          "end": 9.93,
          "text": "Our ancestors, the early and prehistoric humans,"
        },
        {
          "start": 9.96,
          "end": 12.27,
          "text": "mostly ate fruit."
        },
        {
          "start": 12.48,
          "end": 16.79,
          "text": "They could digest plant food quickly and efficiently."
        },
        {
          "start": 19.27,
          "end": 21.84,
          "text": "Now and then they ate meat too."
        },
        {
          "start": 22.73,
          "end": 26.29,
          "text": "For them it was just as easy to digest as plants."
        },
        {
          "start": 27.28,
          "end": 31.76,
          "text": "In evolution, eating animal protein led to growth –"
        },
        {
          "start": 31.78,
          "end": 33.24,
          "text": "of the brain as well."
        },
        {
          "start": 33.57,
          "end": 36.73,
          "text": "Whether cognitive abilities increased as a result"
        },
        {
          "start": 36.79,
          "end": 39.18,
          "text": "is disputed among scientists."
        },
        {
          "start": 39.75,
          "end": 43.75,
          "text": "The average German eats about 60 kilograms of meat a year!"
        },
        {
          "start": 43.95,
          "end": 47.99,
          "text": "Far too much, critics say: eating too much meat"
        },
        {
          "start": 48.05,
          "end": 51.8,
          "text": "is a health risk and can cause cancer!"
        },
        {
          "start": 52.5,
          "end": 55.99,
          "text": "Yet nutritionally, meat seems indispensable:"
        },
        {
          "start": 56.07,
          "end": 59.65,
          "text": "it contains protein, minerals such as iron and zinc,"
        },
        {
          "start": 59.68,
          "end": 62.52,
          "text": "and plenty of selenium and B vitamins."
        },
        {
          "start": 63.08,
          "end": 65.79,
          "text": "But the German Nutrition Society recommends"
        },
        {
          "start": 65.81,
          "end": 68.4,
          "text": "eating at most 600 grams of meat a week."
        },
        {
          "start": 68.53,
          "end": 71.49,
          "text": "That way the body also gets the important vitamin B12,"
        },
        {
          "start": 71.54,
          "end": 73.93,
          "text": "which is especially easy to absorb from meat."
        },
        {
          "start": 74.38,
          "end": 75.78,
          "text": "Anyone who eats vegan"
        },
        {
          "start": 75.82,
          "end": 79.6,
          "text": "has to get vitamin B12 from other sources"
        },
        {
          "start": 79.63,
          "end": 81.8,
          "text": "to prevent deficiency symptoms."
        }
      ]
    }
  },
  {
    "id": "terra-x-angriff-von-retroviren",
    "title": {
      "zh": "逆转录病毒的入侵",
      "de": "Angriff von Retroviren",
      "en": "The Retrovirus Attack"
    },
    "file": "terra-x/angriff-von-retroviren.mp4",
    "duration": 67.4,
    "credit": "3sat/nano · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Angriff_von_Retroviren.webm",
    "subtitles": {
      "zh": [
        {
          "start": 3.01,
          "end": 7.44,
          "text": "和其他病毒一样，逆转录病毒也会感染细胞，强迫细胞"
        },
        {
          "start": 7.5,
          "end": 9.96,
          "text": "制造更多的逆转录病毒。"
        },
        {
          "start": 10.6,
          "end": 13.27,
          "text": "这只是入侵的第一步。"
        },
        {
          "start": 13.98,
          "end": 17.7,
          "text": "逆转录病毒还会钻进遗传物质里安家。"
        },
        {
          "start": 17.95,
          "end": 19.93,
          "text": "人类身上也会发生这种事。"
        },
        {
          "start": 20.21,
          "end": 22.22,
          "text": "它们成了我们的一部分。"
        },
        {
          "start": 22.8,
          "end": 26.6,
          "text": "因为这样一来，我们会把病毒遗传给后代。"
        },
        {
          "start": 27.18,
          "end": 29.62,
          "text": "但只有很少的病毒能做到这一点。"
        },
        {
          "start": 30.8,
          "end": 33.68,
          "text": "我们基因组里的每一个逆转录病毒，"
        },
        {
          "start": 33.76,
          "end": 38.25,
          "text": "都代表着其他病毒无数次失败的尝试。"
        },
        {
          "start": 39.77,
          "end": 43.03,
          "text": "我们人类和进化史上所有的祖先，"
        },
        {
          "start": 43.09,
          "end": 46.78,
          "text": "几百万年来一直受到逆转录病毒的攻击。"
        },
        {
          "start": 47.48,
          "end": 51.75,
          "text": "这些病毒和其他病毒在我们的生殖细胞系里扎下了根，"
        },
        {
          "start": 51.8,
          "end": 55.52,
          "text": "足足占了我们 DNA 的 47%。"
        },
        {
          "start": 55.54,
          "end": 58.66,
          "text": "只有 2% 决定我们身体的构造，"
        },
        {
          "start": 58.7,
          "end": 63.04,
          "text": "还有 51% 控制基因如何、何时被读取，"
        },
        {
          "start": 63.06,
          "end": 65.26,
          "text": "也就是被激活。"
        }
      ],
      "de": [
        {
          "start": 3.01,
          "end": 7.44,
          "text": "Wie andere Viren befallen auch Retroviren Zellen und zwingen diese,"
        },
        {
          "start": 7.5,
          "end": 9.96,
          "text": "weitere Retroviren zu produzieren."
        },
        {
          "start": 10.6,
          "end": 13.27,
          "text": "Das ist nur die erste Stufe des Angriffs."
        },
        {
          "start": 13.98,
          "end": 17.7,
          "text": "Zusätzlich nisten sich die Retroviren im Erbgut ein."
        },
        {
          "start": 17.95,
          "end": 19.93,
          "text": "Das passiert auch beim Menschen."
        },
        {
          "start": 20.21,
          "end": 22.22,
          "text": "Sie werden ein Teil von uns."
        },
        {
          "start": 22.8,
          "end": 26.6,
          "text": "Denn jetzt vererben wir das Virus an unsere Nachkommen."
        },
        {
          "start": 27.18,
          "end": 29.62,
          "text": "Doch nur wenige Viren schaffen das."
        },
        {
          "start": 30.8,
          "end": 33.68,
          "text": "Jedes Retrovirus in unserem Erbgut"
        },
        {
          "start": 33.76,
          "end": 38.25,
          "text": "steht für unzählige gescheiterte Versuche anderer Viren."
        },
        {
          "start": 39.77,
          "end": 43.03,
          "text": "Wir Menschen und all unsere Vorfahren in der Evolution"
        },
        {
          "start": 43.09,
          "end": 46.78,
          "text": "wurden über Millionen von Jahren von Retroviren angegriffen."
        },
        {
          "start": 47.48,
          "end": 51.75,
          "text": "Diese und andere Viren konnten sich in unserer Keimbahn verankern"
        },
        {
          "start": 51.8,
          "end": 55.52,
          "text": "und machen immerhin 47 Prozent unserer DNA aus."
        },
        {
          "start": 55.54,
          "end": 58.66,
          "text": "Nur zwei Prozent legen unseren Körperaufbau fest,"
        },
        {
          "start": 58.7,
          "end": 63.04,
          "text": "und 51 Prozent steuern, wie und wann Gene ausgelesen,"
        },
        {
          "start": 63.06,
          "end": 65.26,
          "text": "also aktiviert werden."
        }
      ],
      "en": [
        {
          "start": 3.01,
          "end": 7.44,
          "text": "Like other viruses, retroviruses infect cells and force them"
        },
        {
          "start": 7.5,
          "end": 9.96,
          "text": "to produce more retroviruses."
        },
        {
          "start": 10.6,
          "end": 13.27,
          "text": "That is only the first stage of the attack."
        },
        {
          "start": 13.98,
          "end": 17.7,
          "text": "In addition, the retroviruses settle into the genome."
        },
        {
          "start": 17.95,
          "end": 19.93,
          "text": "That happens in humans too."
        },
        {
          "start": 20.21,
          "end": 22.22,
          "text": "They become part of us."
        },
        {
          "start": 22.8,
          "end": 26.6,
          "text": "Because now we pass the virus on to our offspring."
        },
        {
          "start": 27.18,
          "end": 29.62,
          "text": "But only a few viruses manage that."
        },
        {
          "start": 30.8,
          "end": 33.68,
          "text": "Every retrovirus in our genome"
        },
        {
          "start": 33.76,
          "end": 38.25,
          "text": "stands for countless failed attempts by other viruses."
        },
        {
          "start": 39.77,
          "end": 43.03,
          "text": "We humans and all our ancestors in evolution"
        },
        {
          "start": 43.09,
          "end": 46.78,
          "text": "have been attacked by retroviruses for millions of years."
        },
        {
          "start": 47.48,
          "end": 51.75,
          "text": "These and other viruses were able to anchor themselves in our germline"
        },
        {
          "start": 51.8,
          "end": 55.52,
          "text": "and make up no less than 47 percent of our DNA."
        },
        {
          "start": 55.54,
          "end": 58.66,
          "text": "Only two percent determine how our body is built,"
        },
        {
          "start": 58.7,
          "end": 63.04,
          "text": "and 51 percent control how and when genes are read,"
        },
        {
          "start": 63.06,
          "end": 65.26,
          "text": "that is, activated."
        }
      ]
    }
  },
  {
    "id": "terra-x-adolf-hitler-vom-schuler-zum-fuhrer",
    "title": {
      "zh": "希特勒：从学生到“元首”",
      "de": "Adolf Hitler - vom Schüler zum Führer",
      "en": "Adolf Hitler: From Pupil to Führer"
    },
    "file": "terra-x/adolf-hitler-vom-schuler-zum-fuhrer.mp4",
    "duration": 113.3,
    "credit": "ZDF/Terra X · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Adolf_Hitler_-_vom_Sch%C3%BCler_zum_F%C3%BChrer.webm",
    "subtitles": {
      "zh": [
        {
          "start": 1.6,
          "end": 12.0,
          "text": "年轻的阿道夫·希特勒是个爱做梦的人。他不是个好学生，在家常挨父亲的打。面对压力，他常常倔强又暴躁。"
        },
        {
          "start": 12.6,
          "end": 18.0,
          "text": "少年时代，他躲进幻想世界，比如卡尔·迈的冒险故事里。"
        },
        {
          "start": 18.8,
          "end": 24.0,
          "text": "父亲去世后，他没拿到毕业证就离开了学校，决定当艺术家。"
        },
        {
          "start": 24.6,
          "end": 29.8,
          "text": "他报考维也纳美术学院——落榜了。两次。"
        },
        {
          "start": 30.6,
          "end": 35.4,
          "text": "他在维也纳靠卖素描、水彩画和油画勉强度日。"
        },
        {
          "start": 36.0,
          "end": 48.4,
          "text": "从 1914 年起，他自愿加入德国军队参加第一次世界大战。可德意志帝国输掉了战争，德国皇帝在 1918 年底被迫退位。"
        },
        {
          "start": 49.0,
          "end": 59.2,
          "text": "这时德国国内的右翼和左翼团体互相争斗。1919 年，希特勒在军队里接受了反共宣传培训。"
        },
        {
          "start": 59.6,
          "end": 69.6,
          "text": "他在那里吸收了日后意识形态的许多成分：仇恨犹太人，仇恨他所谓的“国际金融资本主义”。"
        },
        {
          "start": 71.6,
          "end": 82.4,
          "text": "培训中他的演讲天赋也被发现了。1919 年底，他加入了一个很小的极右翼小党——德意志工人党。"
        },
        {
          "start": 82.8,
          "end": 91.0,
          "text": "1920 年 2 月，这个党改名为民族社会主义德意志工人党，简称纳粹党（NSDAP）。"
        },
        {
          "start": 92.4,
          "end": 103.6,
          "text": "凭着演讲天赋、策略手腕和权力欲，他很快爬上党的顶层，不久就成了无可争议的领袖。"
        },
        {
          "start": 104.0,
          "end": 109.4,
          "text": "1933 年，他在德国夺取了政权——带来了灾难性的后果。"
        }
      ],
      "de": [
        {
          "start": 1.6,
          "end": 12.0,
          "text": "Der junge Adolf Hitler war ein Träumer. Er war kein besonders guter Schüler und zuhause bezog er von seinem Vater Prügel. Auf Druck reagierte er oft trotzig und jähzornig."
        },
        {
          "start": 12.6,
          "end": 18.0,
          "text": "Der Heranwachsende flüchtete sich in Fantasiewelten, etwa in die Geschichten Karl Mays."
        },
        {
          "start": 18.8,
          "end": 24.0,
          "text": "Nach dem Tod des Vaters verließ er die Schule ohne Abschluss und beschloss, Künstler zu werden."
        },
        {
          "start": 24.6,
          "end": 29.8,
          "text": "Er bewarb sich an der Akademie der bildenden Künste in Wien – und scheiterte. Zwei Mal."
        },
        {
          "start": 30.6,
          "end": 35.4,
          "text": "Er schlug sich in Wien mit dem Verkauf von Zeichnungen, Aquarellen und Ölbildern durch."
        },
        {
          "start": 36.0,
          "end": 48.4,
          "text": "Ab 1914 kämpfte er im Ersten Weltkrieg freiwillig als Soldat im deutschen Heer. Das Deutsche Reich verlor jedoch den Krieg und der deutsche Kaiser musste Ende 1918 abdanken."
        },
        {
          "start": 49.0,
          "end": 59.2,
          "text": "Jetzt kämpften in Deutschland rechte und linke Gruppen gegeneinander. Hitler erhielt 1919 in der Armee eine antikommunistische Propaganda-Schulung."
        },
        {
          "start": 59.6,
          "end": 69.6,
          "text": "Dort schnappte er viele Bestandteile seiner späteren Ideologie auf: Hass auf Juden und auf den „internationalen Finanzkapitalismus“, wie er ihn nannte."
        },
        {
          "start": 71.6,
          "end": 82.4,
          "text": "In der Schulung wurde auch sein Redetalent entdeckt. Ende 1919 trat er in eine winzige, rechtsextreme Splitterpartei ein, die Deutsche Arbeiterpartei."
        },
        {
          "start": 82.8,
          "end": 91.0,
          "text": "Im Februar 1920 wurde sie umbenannt in Nationalsozialistische Deutsche Arbeiterpartei, kurz NSDAP."
        },
        {
          "start": 92.4,
          "end": 103.6,
          "text": "Wegen seines Redetalents, seines strategischen Geschicks und seines Willens zur Macht stieg er schnell an die Spitze der Partei auf und wurde schon bald zu deren unumstrittenen Führer."
        },
        {
          "start": 104.0,
          "end": 109.4,
          "text": "1933 übernahm er die Macht in Deutschland – mit verheerenden Folgen."
        }
      ],
      "en": [
        {
          "start": 1.6,
          "end": 12.0,
          "text": "The young Adolf Hitler was a dreamer. He was not a particularly good pupil, and at home his father beat him. He often reacted to pressure with defiance and fits of temper."
        },
        {
          "start": 12.6,
          "end": 18.0,
          "text": "As a teenager he escaped into fantasy worlds, such as the stories of Karl May."
        },
        {
          "start": 18.8,
          "end": 24.0,
          "text": "After his father's death he left school without qualifications and decided to become an artist."
        },
        {
          "start": 24.6,
          "end": 29.8,
          "text": "He applied to the Academy of Fine Arts in Vienna – and failed. Twice."
        },
        {
          "start": 30.6,
          "end": 35.4,
          "text": "In Vienna he scraped a living selling drawings, watercolours and oil paintings."
        },
        {
          "start": 36.0,
          "end": 48.4,
          "text": "From 1914 he volunteered as a soldier in the German army in the First World War. But the German Empire lost the war, and the Kaiser had to abdicate at the end of 1918."
        },
        {
          "start": 49.0,
          "end": 59.2,
          "text": "Now right-wing and left-wing groups fought each other in Germany. In 1919 Hitler received anti-communist propaganda training in the army."
        },
        {
          "start": 59.6,
          "end": 69.6,
          "text": "There he picked up many elements of his later ideology: hatred of Jews and of 'international finance capitalism', as he called it."
        },
        {
          "start": 71.6,
          "end": 82.4,
          "text": "The training also revealed his talent for speaking. At the end of 1919 he joined a tiny far-right splinter party, the German Workers' Party."
        },
        {
          "start": 82.8,
          "end": 91.0,
          "text": "In February 1920 it was renamed the National Socialist German Workers' Party, NSDAP for short."
        },
        {
          "start": 92.4,
          "end": 103.6,
          "text": "With his talent for speaking, his strategic skill and his will to power, he quickly rose to the top of the party and soon became its undisputed leader."
        },
        {
          "start": 104.0,
          "end": 109.4,
          "text": "In 1933 he seized power in Germany – with devastating consequences."
        }
      ]
    }
  },
  {
    "id": "terra-x-creative-commons-clips-zur-freien-nutzung-einfach-er",
    "title": {
      "zh": "可自由使用的 CC 科普短片",
      "de": "Creative Commons-Clips zur freien Nutzung – einfach erklärt",
      "en": "Creative Commons Clips Explained"
    },
    "file": "terra-x/creative-commons-clips-zur-freien-nutzung-einfach-erklart-te.mp4",
    "duration": 117.0,
    "credit": "ZDF/Terra X · CC BY 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Creative_Commons-Clips_zur_freien_Nutzung_%E2%80%93_einfach_erkl%C3%A4rt_(Terra_X,_ZDF).webm",
    "subtitles": {
      "zh": [
        {
          "start": 0.51,
          "end": 5.76,
          "text": "这是 ZDF 媒体库里 Terra X 的知识共享（Creative Commons）片库。"
        },
        {
          "start": 6.2,
          "end": 9.94,
          "text": "它会改变你们使用知识的方式。"
        },
        {
          "start": 10.97,
          "end": 15.32,
          "text": "我们在这里把最好的知识内容免费提供给大家。"
        },
        {
          "start": 16.79,
          "end": 19.5,
          "text": "什么是群体免疫？"
        },
        {
          "start": 20.16,
          "end": 23.48,
          "text": "世界历史上第一座大都市在哪里？"
        },
        {
          "start": 23.91,
          "end": 26.74,
          "text": "有通往太空的电梯吗？"
        },
        {
          "start": 26.83,
          "end": 29.59,
          "text": "全球变暖会带来什么后果？"
        },
        {
          "start": 30.26,
          "end": 32.1,
          "text": "这些还有更多内容，"
        },
        {
          "start": 32.14,
          "end": 37.3,
          "text": "都在我们的网站“terrax-cc.zdf.de”上。"
        },
        {
          "start": 40.68,
          "end": 42.15,
          "text": "特别之处在哪？"
        },
        {
          "start": 42.19,
          "end": 45.52,
          "text": "你们可以直接下载这些科普短片、修改它们——"
        },
        {
          "start": 45.54,
          "end": 49.5,
          "text": "比如重新剪辑——然后发布到任何地方："
        },
        {
          "start": 49.53,
          "end": 55.12,
          "text": "社交媒体、网站，或者公开的演示里。"
        },
        {
          "start": 56.22,
          "end": 57.7,
          "text": "前提是："
        },
        {
          "start": 57.76,
          "end": 61.53,
          "text": "遵守短片下方写的 CC 条款。"
        },
        {
          "start": 62.68,
          "end": 65.22,
          "text": "第一：注明作者。"
        },
        {
          "start": 65.26,
          "end": 68.52,
          "text": "作者名字就写在我们的科普短片下面。"
        },
        {
          "start": 69.22,
          "end": 71.48,
          "text": "在你们的视频里把名字显示出来。"
        },
        {
          "start": 71.51,
          "end": 75.16,
          "text": "比如放在这里、这里，或者这里。"
        },
        {
          "start": 76.2,
          "end": 77.18,
          "text": "第二："
        },
        {
          "start": 77.22,
          "end": 81.52,
          "text": "在你们的视频里也加上 CC 标志，并注明这个链接。"
        },
        {
          "start": 82.54,
          "end": 85.81,
          "text": "因为知识共享，简称 CC，是一种许可协议，"
        },
        {
          "start": 85.83,
          "end": 90.74,
          "text": "让作者可以很简单地把作品开放给别人使用。"
        },
        {
          "start": 91.03,
          "end": 96.78,
          "text": "在我们 ZDF，主要用的是特别开放的 CC BY 4.0 许可。"
        },
        {
          "start": 97.02,
          "end": 99.5,
          "text": "唯一不允许的是："
        },
        {
          "start": 99.89,
          "end": 103.26,
          "text": "不能歪曲短片的内容和形式，"
        },
        {
          "start": 103.28,
          "end": 106.24,
          "text": "更不能把它的意思颠倒过来。"
        },
        {
          "start": 106.43,
          "end": 108.75,
          "text": "那还等什么？"
        },
        {
          "start": 108.89,
          "end": 115.27,
          "text": "快去“terrax-cc.zdf.de”用我们的 CC 短片吧！"
        }
      ],
      "de": [
        {
          "start": 0.51,
          "end": 5.76,
          "text": "Das ist das Terra X Creative Commons-Angebot der ZDF-Mediathek."
        },
        {
          "start": 6.2,
          "end": 9.94,
          "text": "Es wird die Art, wie Ihr mit Wissen umgeht, verändern."
        },
        {
          "start": 10.97,
          "end": 15.32,
          "text": "Hier stellen wir Euch unsere besten Wissensinhalte frei zur Verfügung."
        },
        {
          "start": 16.79,
          "end": 19.5,
          "text": "Was ist Herdenimmunität?"
        },
        {
          "start": 20.16,
          "end": 23.48,
          "text": "Wo entstand die erste Metropole der Weltgeschichte?"
        },
        {
          "start": 23.91,
          "end": 26.74,
          "text": "Gibt es einen Fahrstuhl in den Weltraum?"
        },
        {
          "start": 26.83,
          "end": 29.59,
          "text": "Welche Folgen hat die Erderwärmung?"
        },
        {
          "start": 30.26,
          "end": 32.1,
          "text": "All das und noch viel mehr"
        },
        {
          "start": 32.14,
          "end": 37.3,
          "text": "findet Ihr auf unserer Homepage unter „terrax-cc.zdf.de“"
        },
        {
          "start": 40.68,
          "end": 42.15,
          "text": "Das Besondere?"
        },
        {
          "start": 42.19,
          "end": 45.52,
          "text": "Ihr dürft die Erklär-Clips einfach herunterladen, verändern -"
        },
        {
          "start": 45.54,
          "end": 49.5,
          "text": "also zum Beispiel neu schneiden - und dann überall veröffentlichen:"
        },
        {
          "start": 49.53,
          "end": 55.12,
          "text": "in den sozialen Medien, auf einer Website oder in einer öffentlichen Präsentation."
        },
        {
          "start": 56.22,
          "end": 57.7,
          "text": "Voraussetzung ist:"
        },
        {
          "start": 57.76,
          "end": 61.53,
          "text": "Haltet Euch an die CC-Bedingungen, die unter den Clips stehen."
        },
        {
          "start": 62.68,
          "end": 65.22,
          "text": "Erstens: Nennt die Urheber*innen."
        },
        {
          "start": 65.26,
          "end": 68.52,
          "text": "Die Namen findet Ihr unter unseren Erklär-Clips."
        },
        {
          "start": 69.22,
          "end": 71.48,
          "text": "Macht sie in Eurem Clip sichtbar."
        },
        {
          "start": 71.51,
          "end": 75.16,
          "text": "Also, zum Beispiel hier, hier, oder, hier."
        },
        {
          "start": 76.2,
          "end": 77.18,
          "text": "Zweitens:"
        },
        {
          "start": 77.22,
          "end": 81.52,
          "text": "Fügt auch bei Eurem Clip das CC-Logo ein und verweist auf diesen Link"
        },
        {
          "start": 82.54,
          "end": 85.81,
          "text": "Denn die Creative Commons - kurz CC - ist eine Lizenz,"
        },
        {
          "start": 85.83,
          "end": 90.74,
          "text": "die es Urheber*innen ermöglicht ihre Werke unkompliziert für andere freizugeben."
        },
        {
          "start": 91.03,
          "end": 96.78,
          "text": "Bei uns im ZDF findet Ihr vor allem die besonders freie CC BY 4.0-Lizenz."
        },
        {
          "start": 97.02,
          "end": 99.5,
          "text": "Das einzige, was nicht erlaubt ist:"
        },
        {
          "start": 99.89,
          "end": 103.26,
          "text": "Ihr dürft Inhalt und Form der Clips nicht entstellen"
        },
        {
          "start": 103.28,
          "end": 106.24,
          "text": "oder gar in ihrer Aussage umkehren."
        },
        {
          "start": 106.43,
          "end": 108.75,
          "text": "Also, worauf wartet Ihr noch?"
        },
        {
          "start": 108.89,
          "end": 115.27,
          "text": "Nutzt unsere CC-Clips auf „terrax-cc.zdf.de“"
        }
      ],
      "en": [
        {
          "start": 0.51,
          "end": 5.76,
          "text": "This is the Terra X Creative Commons collection in the ZDF media library."
        },
        {
          "start": 6.2,
          "end": 9.94,
          "text": "It will change the way you deal with knowledge."
        },
        {
          "start": 10.97,
          "end": 15.32,
          "text": "Here we make our best knowledge content freely available to you."
        },
        {
          "start": 16.79,
          "end": 19.5,
          "text": "What is herd immunity?"
        },
        {
          "start": 20.16,
          "end": 23.48,
          "text": "Where did the first metropolis in world history arise?"
        },
        {
          "start": 23.91,
          "end": 26.74,
          "text": "Is there an elevator into space?"
        },
        {
          "start": 26.83,
          "end": 29.59,
          "text": "What are the consequences of global warming?"
        },
        {
          "start": 30.26,
          "end": 32.1,
          "text": "All this and much more"
        },
        {
          "start": 32.14,
          "end": 37.3,
          "text": "you'll find on our homepage at 'terrax-cc.zdf.de'."
        },
        {
          "start": 40.68,
          "end": 42.15,
          "text": "What's special?"
        },
        {
          "start": 42.19,
          "end": 45.52,
          "text": "You may simply download the explainer clips, change them –"
        },
        {
          "start": 45.54,
          "end": 49.5,
          "text": "for example re-edit them – and then publish them anywhere:"
        },
        {
          "start": 49.53,
          "end": 55.12,
          "text": "on social media, on a website or in a public presentation."
        },
        {
          "start": 56.22,
          "end": 57.7,
          "text": "The condition is:"
        },
        {
          "start": 57.76,
          "end": 61.53,
          "text": "stick to the CC terms listed under the clips."
        },
        {
          "start": 62.68,
          "end": 65.22,
          "text": "First: name the authors."
        },
        {
          "start": 65.26,
          "end": 68.52,
          "text": "You'll find the names under our explainer clips."
        },
        {
          "start": 69.22,
          "end": 71.48,
          "text": "Make them visible in your clip."
        },
        {
          "start": 71.51,
          "end": 75.16,
          "text": "For example here, here, or here."
        },
        {
          "start": 76.2,
          "end": 77.18,
          "text": "Second:"
        },
        {
          "start": 77.22,
          "end": 81.52,
          "text": "add the CC logo to your clip too and refer to this link."
        },
        {
          "start": 82.54,
          "end": 85.81,
          "text": "Because Creative Commons – CC for short – is a licence"
        },
        {
          "start": 85.83,
          "end": 90.74,
          "text": "that lets authors easily share their works with others."
        },
        {
          "start": 91.03,
          "end": 96.78,
          "text": "At ZDF you'll mainly find the especially free CC BY 4.0 licence."
        },
        {
          "start": 97.02,
          "end": 99.5,
          "text": "The only thing not allowed:"
        },
        {
          "start": 99.89,
          "end": 103.26,
          "text": "you may not distort the content and form of the clips"
        },
        {
          "start": 103.28,
          "end": 106.24,
          "text": "or even reverse what they say."
        },
        {
          "start": 106.43,
          "end": 108.75,
          "text": "So what are you waiting for?"
        },
        {
          "start": 108.89,
          "end": 115.27,
          "text": "Use our CC clips at 'terrax-cc.zdf.de'!"
        }
      ]
    }
  }
];
