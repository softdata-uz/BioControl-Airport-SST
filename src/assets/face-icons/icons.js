import noMaskIcon from '../face-icons/emojes/noMask.png'
import withMaskIcon from '../face-icons/emojes/withMask.png'
import withBeard from '../face-icons/emojes/withBeard.png'
import noBeard from '../face-icons/emojes/noBeard.png'


import maleIcon2 from '../face-icons/emojes/maleIcon.png'
import femaleIcon2 from '../face-icons/emojes/femaleIcon.png'

import male_0_10 from '../face-icons/emojes/male/age_0_10.png'
import male_11_17 from '../face-icons/emojes/male/age_11_17.png'
import male_18_25 from '../face-icons/emojes/male/age_18_25.png'
import male_26_40 from '../face-icons/emojes/male/age_26_40.png'
import male_41_60 from '../face-icons/emojes/male/age_41_60.png'
import male_61 from '../face-icons/emojes/male/age_61.png'

import female_0_10 from '../face-icons/emojes/female/age_0_10.png'
import female_11_17 from '../face-icons/emojes/female/age_11_17.png'
import female_18_25 from '../face-icons/emojes/female/age_18_25.png'
import female_26_40 from '../face-icons/emojes/female/age_26_40.png'
import female_41_60 from '../face-icons/emojes/female/age_41_60.png'
import female_61 from '../face-icons/emojes/female/age_61.png'

import mood_2 from '../face-icons/emojes/mood/2.png'
import mood_3 from '../face-icons/emojes/mood/3.png'
import mood_4 from '../face-icons/emojes/mood/4.png'
import mood_5 from '../face-icons/emojes/mood/5.png'
import mood_6 from '../face-icons/emojes/mood/6.png'
import mood_7 from '../face-icons/emojes/mood/7.png'
import mood_8 from '../face-icons/emojes/mood/8.png'
import mood_9 from '../face-icons/emojes/mood/9.png'
import mood_11 from '../face-icons/emojes/mood/11.png'
import mood_12 from '../face-icons/emojes/mood/12.png'
import mood_13 from '../face-icons/emojes/mood/13.png'

import withGlass from '../face-icons/emojes/withGlass.png'
import withSunglass from '../face-icons/emojes/withSunglass.png'
import noGlass from '../face-icons/emojes/noGlass.png'

// const mood = ["", "Jilmaygan", "Jahldor", "Xafa", "Jirkangan", "Qo'rqqan", "Hayratda", "E'tiborsiz", "Kulgan", "", "Xursand", "Ikkilangan", "Baqirgan"]

export const emojes = {
  mood: ['', mood_2, mood_3, mood_4, mood_5, mood_6, mood_7, mood_8, mood_9, '', mood_11, mood_12, mood_13],
  mask: ['', '', noMaskIcon,  withMaskIcon, ],
  beard: ['', '', noBeard, withBeard, ],
  glass: {
    "0": noGlass,
    "1": withGlass,
    "10": noGlass,
    "14": withSunglass
  },
  male: {
    "male": maleIcon2,
    "age_0_10": male_0_10,
    "age_11_17": male_11_17,
    "age_18_25": male_18_25,
    "age_26_40": male_26_40,
    "age_41_60": male_41_60,
    "age_61_": male_61,
  },
  female: {
    "female": femaleIcon2,
    "age_0_10": female_0_10,
    "age_11_17": female_11_17,
    "age_18_25": female_18_25,
    "age_26_40": female_26_40,
    "age_41_60": female_41_60,
    "age_61_": female_61,
  },
}