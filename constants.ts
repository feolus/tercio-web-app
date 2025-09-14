import { Troop, Weapon, Role, Artillery, NobilityTitle } from './types';

export const BATTLE_TASK_OPTIONS = [
    "Puerta", "Brecha", "Muralla 1", "Muralla 2", "Muralla 3",
    "Popeo", "Pueblo 1", "Pueblo 2", "Reserva", "Otro"
];

export const INITIAL_TROOPS: Troop[] = [
    // Tier 5
    { id: 't5_iron_reapers', name: 'Iron Reapers', tier: 5, leadership: 300, imageUrl: 'https://picsum.photos/seed/t5_iron_reapers/100/100' },
    { id: 't5_pavise_crossbowmen', name: 'Pavise Crossbowmen', tier: 5, leadership: 280, imageUrl: 'https://picsum.photos/seed/t5_pavise_crossbowmen/100/100' },
    { id: 't5_tercios_arquebusiers', name: 'Tercios Arquebusiers', tier: 5, leadership: 280, imageUrl: 'https://picsum.photos/seed/t5_tercios_arquebusiers/100/100' },
    { id: 't5_shenji_grenadiers', name: 'Shenji Grenadiers', tier: 5, leadership: 315, imageUrl: 'https://picsum.photos/seed/t5_shenji_grenadiers/100/100' },
    { id: 't5_cataphract_lancers', name: 'Cataphract Lancers', tier: 5, leadership: 305, imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA8ADwDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAcFBgIEAwH/xAAyEAABAwIFAgMGBgMAAAAAAAABAgMEBQAGERIhMUEHIlFhcRMygZGhFCOCwdFSYoLw/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAfEQEBAAICAgMBAAAAAAAAAAAAAQIRAyESMUEiUW H/2gAMAwEAAhEDEQA/APqmgAoAoAoAoDLXO+aLb7rT7bWZHWlyyA46hJ2NpKggEnvkkY+gOcaRtbW2r0z5V2s6rV6Y1/FqZ8+W2Y4+P0yMvVyt9uSpdyq8OnISkqJfdSjA9snOB9Thh1s6Xz61ZFrWv8y2p8yXW6pXnZLDy3Y8dnfHjoJylA7nHucnJzknOMm/K2+TPLkzvPl2f+2vJ+GfH+Gv47R6zVqTVKgyqpWJTsmW+re464cqUf89gOAMAYJvK1tGsa1isKyAoAoDBX7c1Dt2E3InNuO+I4W0IaAKiQkqzgnGMA/wA98Yq1axrN52iIiZ9IiU/T69BqsFubGbcShwEoDqAlRBODwScZBOM4OMHGSM8tWtqzW0fD4AKAKAKAKAZ+97Qpd2S25E1x5l5psNBbeDtSFEjAI75UefPjAwc4tWtaTW0WiZmd5lG2/b9NtyC5Eprjy0OOF1SnSAoqISnOQAM4SB/zzwRa1a1isLdgKAKA8PtNvNradQlbawUqSoZBB5BB8xheJmNpVExO8Syb92FRX5C32qXGZWskq6bRQSfXb7sfQAYzFr4/FeZ/p18zPqf5eY2z6QzS6DS6S8p+mwWI7q07FLbQEqUnOcE+Yz3wY1pWsVpCsAKAKAKA//2Q==' },
    { id: 't5_winged_hussars', name: 'Winged Hussars', tier: 5, leadership: 305, imageUrl: 'https://picsum.photos/seed/t5_winged_hussars/100/100' },
    { id: 't5_fire_lancers', name: 'Fire Lancers', tier: 5, leadership: 285, imageUrl: 'https://picsum.photos/seed/t5_fire_lancers/100/100' },
    { id: 't5_monastic_knights', name: 'Monastic Knights', tier: 5, leadership: 295, imageUrl: 'https://picsum.photos/seed/t5_monastic_knights/100/100' },
    { id: 't5_rattan_rangers', name: 'Rattan Rangers', tier: 5, leadership: 295, imageUrl: 'https://picsum.photos/seed/t5_rattan_rangers/100/100' },
    { id: 't5_kheshigs', name: 'Kheshigs', tier: 5, leadership: 300, imageUrl: 'https://picsum.photos/seed/t5_kheshigs/100/100' },
    { id: 't5_falconetti_gunners', name: 'Falconetti Gunners', tier: 5, leadership: 300, imageUrl: 'https://picsum.photos/seed/t5_falconetti_gunners/100/100' },
    { id: 't5_silahdars', name: 'Silahdars', tier: 5, leadership: 300, imageUrl: 'https://picsum.photos/seed/t5_silahdars/100/100' },
    { id: 't5_siphonarioi', name: 'Siphonarioi', tier: 5, leadership: 300, imageUrl: 'https://picsum.photos/seed/t5_siphonarioi/100/100' },
    { id: 't5_liao_rangers', name: 'Liao Rangers', tier: 5, leadership: 315, imageUrl: 'https://picsum.photos/seed/t5_liao_rangers/100/100' },
    { id: 't5_shield_maidens', name: 'Shield Maidens', tier: 5, leadership: 280, imageUrl: 'https://picsum.photos/seed/t5_shield_maidens/100/100' },
    { id: 't5_modao_battalion', name: 'Modao Battalion', tier: 5, leadership: 310, imageUrl: 'https://picsum.photos/seed/t5_modao_battalion/100/100' },
    { id: 't5_houndsmen', name: 'Houndsmen', tier: 5, leadership: 310, imageUrl: 'https://picsum.photos/seed/t5_houndsmen/100/100' },
    { id: 't5_chevaliers', name: 'Chevaliers', tier: 5, leadership: 340, imageUrl: 'https://picsum.photos/seed/t5_chevaliers/100/100' },
    { id: 't5_varangian_guards', name: 'Varangian Guards', tier: 5, leadership: 290, imageUrl: 'https://picsum.photos/seed/t5_varangian_guards/100/100' },
    { id: 't5_retiarii', name: 'Retiarii', tier: 5, leadership: 305, imageUrl: 'https://picsum.photos/seed/t5_retiarii/100/100' },
    { id: 't5_hashashins', name: 'Hashashins', tier: 5, leadership: 295, imageUrl: 'https://picsum.photos/seed/t5_hashashins/100/100' },
    { id: 't5_yanyuedao_cavalry', name: 'Yanyuedao Cavalry', tier: 5, leadership: 320, imageUrl: 'https://picsum.photos/seed/t5_yanyuedao_cavalry/100/100' },
    { id: 't5_orochis_samourais', name: 'Orochis Samourais', tier: 5, leadership: 295, imageUrl: 'https://picsum.photos/seed/t5_orochis_samourais/100/100' },
    { id: 't5_zweihanders', name: 'Zweihanders', tier: 5, leadership: 310, imageUrl: 'https://picsum.photos/seed/t5_zweihanders/100/100' },
    { id: 't5_queen_paladins', name: 'Queen Paladins', tier: 5, leadership: 295, imageUrl: 'https://picsum.photos/seed/t5_queen_paladins/100/100' },
    { id: 't5_xuanjia_heavy_cavalry', name: 'Xuanjia Heavy Cavalry', tier: 5, leadership: 325, imageUrl: 'https://picsum.photos/seed/t5_xuanjia_heavy_cavalry/100/100' },
    { id: 't5_sunward_phalanx', name: 'Sunward Phalanx', tier: 5, leadership: 300, imageUrl: 'https://picsum.photos/seed/t5_sunward_phalanx/100/100' },
    { id: 't5_lionrar_crew', name: 'Lionrar Crew', tier: 5, leadership: 320, imageUrl: 'https://picsum.photos/seed/t5_lionrar_crew/100/100' },
    { id: 't5_spartan_chosen', name: 'Spartan Chosen', tier: 5, leadership: 305, imageUrl: 'https://picsum.photos/seed/t5_spartan_chosen/100/100' },
    { id: 't5_hwarang', name: 'Hwarang', tier: 5, leadership: 290, imageUrl: 'https://picsum.photos/seed/t5_hwarang/100/100' },
    { id: 't5_empire_chariot', name: 'Empire Chariot', tier: 5, leadership: 310, imageUrl: 'https://picsum.photos/seed/t5_empire_chariot/100/100' },

    // Tier 4
    { id: 't4_halberdier_sergeants', name: 'Halberdier Sergeants', tier: 4, leadership: 225, imageUrl: 'https://picsum.photos/seed/t4_halberdier_sergeants/100/100' },
    { id: 't4_imperial_pikemen', name: 'Imperial Pikemen', tier: 4, leadership: 225, imageUrl: 'https://picsum.photos/seed/t4_imperial_pikemen/100/100' },
    { id: 't4_palace_guards', name: 'Palace Guards', tier: 4, leadership: 230, imageUrl: 'https://picsum.photos/seed/t4_palace_guards/100/100' },
    { id: 't4_imperial_spearmen', name: 'Imperial Spearmen', tier: 4, leadership: 235, imageUrl: 'https://picsum.photos/seed/t4_imperial_spearmen/100/100' },
    { id: 't4_javelin_sergeants', name: 'Javelin Sergeants', tier: 4, leadership: 220, imageUrl: 'https://picsum.photos/seed/t4_javelin_sergeants/100/100' },
    { id: 't4_imperial_javelineers', name: 'Imperial Javelineers', tier: 4, leadership: 230, imageUrl: 'https://picsum.photos/seed/t4_imperial_javelineers/100/100' },
    { id: 't4_longbowmen', name: 'Longbowmen', tier: 4, leadership: 225, imageUrl: 'https://picsum.photos/seed/t4_longbowmen/100/100' },
    { id: 't4_imperial_archers', name: 'Imperial Archers', tier: 4, leadership: 220, imageUrl: 'https://picsum.photos/seed/t4_imperial_archers/100/100' },
    { id: 't4_kriegsrat_fusiliers', name: 'Kriegsrat Fusiliers', tier: 4, leadership: 225, imageUrl: 'https://picsum.photos/seed/t4_kriegsrat_fusiliers/100/100' },
    { id: 't4_imperial_arquebusiers', name: 'Imperial Arquebusiers', tier: 4, leadership: 230, imageUrl: 'https://picsum.photos/seed/t4_imperial_arquebusiers/100/100' },
    { id: 't4_yeomen', name: 'Yeomen', tier: 4, leadership: 225, imageUrl: 'https://picsum.photos/seed/t4_yeomen/100/100' },
    { id: 't4_prefecture_cavalry', name: 'Prefecture Cavalry', tier: 4, leadership: 180, imageUrl: 'https://picsum.photos/seed/t4_prefecture_cavalry/100/100' },
    { id: 't4_dagger_axe_lancers', name: 'Dagger-Axe Lancers', tier: 4, leadership: 275, imageUrl: 'https://picsum.photos/seed/t4_dagger_axe_lancers/100/100' },
    { id: 't4_spear_sergeants', name: 'Spear Sergeants', tier: 4, leadership: 215, imageUrl: 'https://picsum.photos/seed/t4_spear_sergeants/100/100' },
    { id: 't4_men_at_arms', name: 'Men at Arms', tier: 4, leadership: 235, imageUrl: 'https://picsum.photos/seed/t4_men_at_arms/100/100' },
    { id: 't4_tseregs', name: 'Tseregs', tier: 4, leadership: 220, imageUrl: 'https://picsum.photos/seed/t4_tseregs/100/100' },
    { id: 't4_fortebraccio', name: 'Fortebraccio', tier: 4, leadership: 220, imageUrl: 'https://picsum.photos/seed/t4_fortebraccio/100/100' },
    { id: 't4_symmachean_stalwarts', name: 'Symmachean Stalwarts', tier: 4, leadership: 240, imageUrl: 'https://picsum.photos/seed/t4_symmachean_stalwarts/100/100' },
    { id: 't4_berserkers', name: 'Berserkers', tier: 4, leadership: 220, imageUrl: 'https://picsum.photos/seed/t4_berserkers/100/100' },
    { id: 't4_axe_raiders', name: 'Axe Raiders', tier: 4, leadership: 220, imageUrl: 'https://picsum.photos/seed/t4_axe_raiders/100/100' },
    
    // Tier 3
    { id: 't3_halberdiers', name: 'Halberdiers', tier: 3, leadership: 150, imageUrl: 'https://picsum.photos/seed/t3_halberdiers/100/100' },
    { id: 't3_prefecture_guards', name: 'Prefecture Guards', tier: 3, leadership: 155, imageUrl: 'https://picsum.photos/seed/t3_prefecture_guards/100/100' },
    { id: 't3_fire_archers', name: 'Fire Archers', tier: 3, leadership: 160, imageUrl: 'https://picsum.photos/seed/t3_fire_archers/100/100' },
    { id: 't3_namkhan_archers', name: 'Namkhan Archers', tier: 3, leadership: 155, imageUrl: 'https://picsum.photos/seed/t3_namkhan_archers/100/100' },
    { id: 't3_condottieri', name: 'Condottieri', tier: 3, leadership: 160, imageUrl: 'https://picsum.photos/seed/t3_condottieri/100/100' },
    { id: 't3_bagpipers', name: 'Bagpipers', tier: 3, leadership: 90, imageUrl: 'https://picsum.photos/seed/t3_bagpipers/100/100' },
    
    // Tier 2
    { id: 't2_pike_militia', name: 'Pike Militia', tier: 2, leadership: 95, imageUrl: 'https://picsum.photos/seed/t2_pike_militia/100/100' },
    { id: 't2_ironcap_swordsmen', name: 'Ironcap Swordsmen', tier: 2, leadership: 75, imageUrl: 'https://picsum.photos/seed/t2_ironcap_swordsmen/100/100' },
    { id: 't2_demesne_javelineers', name: 'Demesne Javelineers', tier: 2, leadership: 80, imageUrl: 'https://picsum.photos/seed/t2_demesne_javelineers/100/100' },

    // Tier 1
    { id: 't1_serfs', name: 'Serfs', tier: 1, leadership: 40, imageUrl: 'https://picsum.photos/seed/t1_serfs/100/100' },
    { id: 't1_woodcutters', name: 'Woodcutters', tier: 1, leadership: 40, imageUrl: 'https://picsum.photos/seed/t1_woodcutters/100/100' },
];

export const INITIAL_WEAPONS: Weapon[] = [
    { id: 'w_shortbow', name: 'Arco corto', imageUrl: 'https://picsum.photos/seed/w_shortbow/100/100' },
    { id: 'w_longbow', name: 'Arco largo', imageUrl: 'https://picsum.photos/seed/w_longbow/100/100' },
    { id: 'w_scimitar', name: 'Cimitarra', imageUrl: 'https://picsum.photos/seed/w_scimitar/100/100' },
    { id: 'w_dual_blades', name: 'Doble empuñadura', imageUrl: 'https://picsum.photos/seed/w_dual_blades/100/100' },
    { id: 'w_shotgun', name: 'Escopeta', imageUrl: 'https://picsum.photos/seed/w_shotgun/100/100' },
    { id: 'w_shortsword', name: 'Espada corta y escudo', imageUrl: 'https://picsum.photos/seed/w_shortsword/100/100' },
    { id: 'w_longsword', name: 'Espada larga y escudo', imageUrl: 'https://picsum.photos/seed/w_longsword/100/100' },
    { id: 'w_glaive', name: 'Guja', imageUrl: 'https://picsum.photos/seed/w_glaive/100/100' },
    { id: 'w_poleaxe', name: 'Hacha de petos', imageUrl: 'https://picsum.photos/seed/w_poleaxe/100/100' },
    { id: 'w_spear', name: 'Lanza', imageUrl: 'https://picsum.photos/seed/w_spear/100/100' },
    { id: 'w_spear_shield', name: 'Lanza y escudo', imageUrl: 'https://picsum.photos/seed/w_spear_shield/100/100' },
    { id: 'w_maul', name: 'Martillo', imageUrl: 'https://picsum.photos/seed/w_maul/100/100' },
    { id: 'w_nodachi', name: 'Nodachi', imageUrl: 'https://picsum.photos/seed/w_nodachi/100/100' },
    { id: 'w_pike', name: 'Pica', imageUrl: 'https://picsum.photos/seed/w_pike/100/100' },
];

export const INITIAL_ARTILLERY: Artillery[] = [
    { id: 'art_bombard', name: 'Bombarda', imageUrl: 'https://picsum.photos/seed/art_bombard/100/100' },
    { id: 'art_catapult', name: 'Catapulta', imageUrl: 'https://picsum.photos/seed/art_catapult/100/100' },
    { id: 'art_flaming_comet', name: 'Cometa Llameante', imageUrl: 'https://picsum.photos/seed/art_flaming_comet/100/100' },
    { id: 'art_siege_ballista', name: 'Balista de Asedio', imageUrl: 'https://picsum.photos/seed/art_siege_ballista/100/100' },
    { id: 'art_war_rockets', name: 'Cohetes de Guerra', imageUrl: 'https://picsum.photos/seed/art_war_rockets/100/100' },
    { id: 'art_divine_crow', name: 'Cuervo Divino (pajaritos)', imageUrl: 'https://picsum.photos/seed/art_divine_crow/100/100' },
    { id: 'art_cannon', name: 'Cañón', imageUrl: 'https://picsum.photos/seed/art_cannon/100/100' },
    { id: 'art_culverin', name: 'Culebrina', imageUrl: 'https://picsum.photos/seed/art_culverin/100/100' },
    { id: 'art_mortar', name: 'Mortero', imageUrl: 'https://picsum.photos/seed/art_mortar/100/100' },
    { id: 'art_grapeshot', name: 'Metralla', imageUrl: 'https://picsum.photos/seed/art_grapeshot/100/100' },
    { id: 'art_scorpion', name: 'Scorpion', imageUrl: 'https://picsum.photos/seed/art_scorpion/100/100' },
    { id: 'art_hwacha', name: 'Lanzador Hwacha', imageUrl: 'https://picsum.photos/seed/art_hwacha/100/100' },
    { id: 'art_siege_tower', name: 'Torre de Asedio', imageUrl: 'https://picsum.photos/seed/art_siege_tower/100/100' },
    { id: 'art_trebuchet', name: 'Trebuchet', imageUrl: 'https://picsum.photos/seed/art_trebuchet/100/100' },
    { id: 'art_battering_ram', name: 'Ariete', imageUrl: 'https://picsum.photos/seed/art_battering_ram/100/100' },
];

export const INITIAL_NOBILITY_TITLES: NobilityTitle[] = [
    { id: 'title_1', name: 'Favor del Comandante' },
    { id: 'title_2', name: 'Héroe de la Semana' },
    { id: 'title_3', name: 'Estratega Maestro' },
    { id: 'title_4', name: 'Defensor Leal' },
    { id: 'title_5', name: 'Conquistador Audaz' },
];
