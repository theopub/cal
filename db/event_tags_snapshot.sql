-- Assign tags to the 60 sample events (IDs 1-60)
-- Each event gets 1-2 random tags from the available tag categories (IDs 1-9)

INSERT INTO red_calendar.event_tags (event_id, tag_id) VALUES
-- Events 1-10: Mix of tags
(1, 1), (1, 2), -- late night, literary/research
(2, 3), (2, 4), -- music/sound, mutual aid/community  
(3, 5), (3, 6), -- performance art, political action
(4, 7), (4, 8), -- queer events, rebel tech
(5, 9), (5, 1), -- visual arts, late night
(6, 2), (6, 3), -- literary/research, music/sound
(7, 4), (7, 5), -- mutual aid/community, performance art
(8, 6), (8, 7), -- political action, queer events
(9, 8), (9, 9), -- rebel tech, visual arts
(10, 1), (10, 2), -- late night, literary/research

-- Events 11-20: Continue pattern
(11, 3), (11, 4), -- music/sound, mutual aid/community
(12, 5), (12, 6), -- performance art, political action
(13, 7), (13, 8), -- queer events, rebel tech
(14, 9), (14, 1), -- visual arts, late night
(15, 2), (15, 3), -- literary/research, music/sound
(16, 4), (16, 5), -- mutual aid/community, performance art
(17, 6), (17, 7), -- political action, queer events
(18, 8), (18, 9), -- rebel tech, visual arts
(19, 1), (19, 2), -- late night, literary/research
(20, 3), (20, 4), -- music/sound, mutual aid/community

-- Events 21-30: Continue pattern
(21, 5), (21, 6), -- performance art, political action
(22, 7), (22, 8), -- queer events, rebel tech
(23, 9), (23, 1), -- visual arts, late night
(24, 2), (24, 3), -- literary/research, music/sound
(25, 4), (25, 5), -- mutual aid/community, performance art
(26, 6), (26, 7), -- political action, queer events
(27, 8), (27, 9), -- rebel tech, visual arts
(28, 1), (28, 2), -- late night, literary/research
(29, 3), (29, 4), -- music/sound, mutual aid/community
(30, 5), (30, 6), -- performance art, political action

-- Events 31-40: Continue pattern
(31, 7), (31, 8), -- queer events, rebel tech
(32, 9), (32, 1), -- visual arts, late night
(33, 2), (33, 3), -- literary/research, music/sound
(34, 4), (34, 5), -- mutual aid/community, performance art
(35, 6), (35, 7), -- political action, queer events
(36, 8), (36, 9), -- rebel tech, visual arts
(37, 1), (37, 2), -- late night, literary/research
(38, 3), (38, 4), -- music/sound, mutual aid/community
(39, 5), (39, 6), -- performance art, political action
(40, 7), (40, 8), -- queer events, rebel tech

-- Events 41-50: Continue pattern
(41, 9), (41, 1), -- visual arts, late night
(42, 2), (42, 3), -- literary/research, music/sound
(43, 4), (43, 5), -- mutual aid/community, performance art
(44, 6), (44, 7), -- political action, queer events
(45, 8), (45, 9), -- rebel tech, visual arts
(46, 1), (46, 2), -- late night, literary/research
(47, 3), (47, 4), -- music/sound, mutual aid/community
(48, 5), (48, 6), -- performance art, political action
(49, 7), (49, 8), -- queer events, rebel tech
(50, 9), (50, 1), -- visual arts, late night

-- Events 51-60: Continue pattern
(51, 2), (51, 3), -- literary/research, music/sound
(52, 4), (52, 5), -- mutual aid/community, performance art
(53, 6), (53, 7), -- political action, queer events
(54, 8), (54, 9), -- rebel tech, visual arts
(55, 1), (55, 2), -- late night, literary/research
(56, 3), (56, 4), -- music/sound, mutual aid/community
(57, 5), (57, 6), -- performance art, political action
(58, 7), (58, 8), -- queer events, rebel tech
(59, 9), (59, 1), -- visual arts, late night
(60, 2), (60, 3); -- literary/research, music/sound
