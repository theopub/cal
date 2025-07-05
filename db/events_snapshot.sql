INSERT INTO red_calendar.events (name,start_date,cost,location,description,owner_name,email,event_url,image_url,created_at,approved,owner_url,event_url_text) VALUES
	 ('Poetry Reading (Yesterday) - 10:00',DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/1.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Yesterday) - 12:00',DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/2.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Yesterday) - 14:00',DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/3.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Yesterday) - 16:00',DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/4.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Yesterday) - 18:00',DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/5.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Today) - 10:00',CURDATE() + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/6.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Today) - 12:00',CURDATE() + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/7.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Today) - 14:00',CURDATE() + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/8.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Today) - 16:00',CURDATE() + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/9.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Today) - 18:00',CURDATE() + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/10.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +1) - 10:00',DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/11.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +1) - 12:00',DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/12.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +1) - 14:00',DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/13.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +1) - 16:00',DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/14.jpg',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +1) - 18:00',DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/15.jpg',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +2) - 10:00',DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/16.jpg',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +2) - 12:00',DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/1.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +2) - 14:00',DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/2.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +2) - 16:00',DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/3.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +2) - 18:00',DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/4.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +3) - 10:00',DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/5.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +3) - 12:00',DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/6.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +3) - 14:00',DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/7.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +3) - 16:00',DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/8.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +3) - 18:00',DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/9.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +4) - 10:00',DATE_ADD(CURDATE(), INTERVAL 4 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/10.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +4) - 12:00',DATE_ADD(CURDATE(), INTERVAL 4 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/11.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +4) - 14:00',DATE_ADD(CURDATE(), INTERVAL 4 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/12.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +4) - 16:00',DATE_ADD(CURDATE(), INTERVAL 4 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/13.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +4) - 18:00',DATE_ADD(CURDATE(), INTERVAL 4 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/14.jpg',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +5) - 10:00',DATE_ADD(CURDATE(), INTERVAL 5 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/15.jpg',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +5) - 12:00',DATE_ADD(CURDATE(), INTERVAL 5 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/16.jpg',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +5) - 14:00',DATE_ADD(CURDATE(), INTERVAL 5 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/1.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +5) - 16:00',DATE_ADD(CURDATE(), INTERVAL 5 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/2.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +5) - 18:00',DATE_ADD(CURDATE(), INTERVAL 5 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/3.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +6) - 10:00',DATE_ADD(CURDATE(), INTERVAL 6 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/4.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +6) - 12:00',DATE_ADD(CURDATE(), INTERVAL 6 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/5.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +6) - 14:00',DATE_ADD(CURDATE(), INTERVAL 6 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/6.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +6) - 16:00',DATE_ADD(CURDATE(), INTERVAL 6 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/7.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +6) - 18:00',DATE_ADD(CURDATE(), INTERVAL 6 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/8.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +7) - 10:00',DATE_ADD(CURDATE(), INTERVAL 7 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/9.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +7) - 12:00',DATE_ADD(CURDATE(), INTERVAL 7 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/10.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +7) - 14:00',DATE_ADD(CURDATE(), INTERVAL 7 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/11.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +7) - 16:00',DATE_ADD(CURDATE(), INTERVAL 7 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/12.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +7) - 18:00',DATE_ADD(CURDATE(), INTERVAL 7 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/13.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +8) - 10:00',DATE_ADD(CURDATE(), INTERVAL 8 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/14.jpg',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +8) - 12:00',DATE_ADD(CURDATE(), INTERVAL 8 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/15.jpg',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +8) - 14:00',DATE_ADD(CURDATE(), INTERVAL 8 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/16.jpg',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +8) - 16:00',DATE_ADD(CURDATE(), INTERVAL 8 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/1.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +8) - 18:00',DATE_ADD(CURDATE(), INTERVAL 8 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/2.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +9) - 10:00',DATE_ADD(CURDATE(), INTERVAL 9 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/3.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +9) - 12:00',DATE_ADD(CURDATE(), INTERVAL 9 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/4.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +9) - 14:00',DATE_ADD(CURDATE(), INTERVAL 9 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/5.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +9) - 16:00',DATE_ADD(CURDATE(), INTERVAL 9 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/6.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +9) - 18:00',DATE_ADD(CURDATE(), INTERVAL 9 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/7.png',NULL,1,'instagram.com/aristilding',''),
	 ('Poetry Reading (Day +10) - 10:00',DATE_ADD(CURDATE(), INTERVAL 10 DAY) + INTERVAL 10 HOUR,'Free','Sunview Luncheonette
221 Nassau Ave','Readings by local poets','Theo Ellin Ballew','theoellinballew@gmail.com','','/posters/8.png',NULL,1,'theo.land/',''),
	 ('Experimental Music Night (Day +10) - 12:00',DATE_ADD(CURDATE(), INTERVAL 10 DAY) + INTERVAL 12 HOUR,'15','Property Is Theft
Williamsburg, Brooklyn','An evening of experimental sounds','j','contact@nyc-noise.com','https://www.propertyistheft.org/events-1','/posters/9.png',NULL,1,'',''),
	 ('Art Exhibition Opening (Day +10) - 14:00',DATE_ADD(CURDATE(), INTERVAL 10 DAY) + INTERVAL 14 HOUR,'0','Gallery Space
Bushwick, Brooklyn','Opening reception for new art installation','Kira M','kira.mcd.99@gmail.com','','/posters/10.png',NULL,1,'@kiracken',''),
	 ('Community Workshop (Day +10) - 16:00',DATE_ADD(CURDATE(), INTERVAL 10 DAY) + INTERVAL 16 HOUR,'Free','Community Center
Queens, NY','Learn new skills with neighbors','Sam','sam.heckle@nyu.edu','','/posters/11.png',NULL,1,'https://community.org/','RSVP'),
	 ('Dance Performance (Day +10) - 18:00',DATE_ADD(CURDATE(), INTERVAL 10 DAY) + INTERVAL 18 HOUR,'25','Performance Space
Manhattan','Contemporary dance showcase','Aristilde Kirby','aristildelki@gmail.com','','/posters/12.png',NULL,1,'instagram.com/aristilding','');