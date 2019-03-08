import {CategoryOption, ItemOption, SizeOption, WeatherOption} from './Option';

export class Options {
  public static weatherOptions: WeatherOption[] = [
    {
      id: 'summer',
      iconClass: 'icon-summer',
    }, {
      id: 'rain',
      iconClass: 'icon-rain',
    }, {
      id: 'winter',
      iconClass: 'icon-winter',
    },
  ];
  public static categoryOptions: CategoryOption[] = [
    {
      id: 'woman',
      iconClass: 'icon-woman',
    }, {
      id: 'man',
      iconClass: 'icon-man',
    }, {
      id: 'girl',
      iconClass: 'icon-girl',
    }, {
      id: 'boy',
      iconClass: 'icon-boy',
    }, {
      id: 'infant',
      iconClass: 'icon-infant',
    },
  ];
  public static sizeOptions: SizeOption[] = [
    {
      id: 'S',
      name: 'S',
    }, {
      id: 'M',
      name: 'M',
    }, {
      id: 'L',
      name: 'L',
    }, {
      id: 'teenager',
      name: '11-16Y (146-176)',
    }, {
      id: 'preteen',
      name: '5-10Y (110-140)',
    }, {
      id: 'child',
      name: '1-4Y (68-104)',
    }, {
      id: 'baby',
      name: 'Baby',
    }, {
      id: '24',
      name: '<24',
    }, {
      id: '242526',
      name: '24/25/26',
    }, {
      id: '272829',
      name: '27/28/29',
    }, {
      id: '303132',
      name: '30/31/32',
    }, {
      id: '333435',
      name: '33/34/35',
    }, {
      id: '363738',
      name: '36/37/38',
    }, {
      id: '3940',
      name: '39/40',
    }, {
      id: '4041',
      name: '40/41',
    }, {
      id: '4243',
      name: '42/43',
    }, {
      id: '44',
      name: '44+',
    }
  ];
  public static itemOptions: ItemOption[] = [
    {
      id: 'boots',
      iconClass: 'icon-boots',
    }, {
      id: 'shoes',
      iconClass: 'icon-shoes',
    }, {
      id: 'sandals',
      iconClass: 'icon-sandals',
    }, {
      id: 'scarf',
      iconClass: 'icon-scarf',
    }, {
      id: 'hat',
      iconClass: 'icon-hat',
    }, {
      id: 'gloves',
      iconClass: 'icon-mat',
    }, {
      id: 'belt',
      iconClass: 'icon-belt',
    }, {
      id: 'pants_long',
      iconClass: 'icon-pants_long',
    }, {
      id: 'pants_short',
      iconClass: 'icon-pants_short',
    }, {
      id: 'shirt',
      iconClass: 'icon-shirt',
    }, {
      id: 'pullover',
      iconClass: 'icon-pullover',
    }, {
      id: 'skirt',
      iconClass: 'icon-skirt',
    }, {
      id: 'dress',
      iconClass: 'icon-dress',
    }, {
      id: 'jacket',
      iconClass: 'icon-jacket',
    }, {
      id: 'tights',
      iconClass: 'icon-tights',
    }, {
      id: 'underwear',
      iconClass: 'icon-underwear',
    }, {
      id: 'bra',
      iconClass: 'icon-bra',
    }, {
      id: 'socks',
      iconClass: 'icon-socks',
    }, {
      id: 'headdress',
      iconClass: 'icon-headdress',
    }, {
      id: 'diaper',
      iconClass: 'icon-diaper',
    }, {
      id: 'babywear',
      iconClass: 'icon-babywear',
    }, {
      id: 'tents',
      iconClass: 'icon-tents',
    }, {
      id: 'blankets',
      iconClass: 'icon-blankets',
    }, {
      id: 'mat',
      iconClass: 'icon-mat',
    }, {
      id: 'sleepingbags',
      iconClass: 'icon-sleepingbags',
    }, {
      id: 'backpack',
      iconClass: 'icon-backpack',
    }, {
      id: 'babycarrier',
      iconClass: 'icon-babycarrier',
    }, {
      id: 'hygiene',
      iconClass: 'icon-hygiene',
    }, {
      id: 'medical',
      iconClass: 'icon-medical',
    }, {
      id: 'questionmark',
      iconClass: 'icon-questionmark',
    }
  ];
}
