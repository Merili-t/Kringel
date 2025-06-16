ALTER TABLE `team_answer` DROP FOREIGN KEY `team_answer_team_id_team_id_fk`;
--> statement-breakpoint
ALTER TABLE `team_answer` ADD CONSTRAINT `team_answer_team_id_test_attempt_id_fk` FOREIGN KEY (`team_id`) REFERENCES `test_attempt`(`id`) ON DELETE cascade ON UPDATE no action;