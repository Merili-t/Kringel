ALTER TABLE `team` DROP FOREIGN KEY `team_attempt_id_test_attempt_id_fk`;
--> statement-breakpoint
ALTER TABLE `team_answer` DROP FOREIGN KEY `team_answer_team_id_team_id_fk`;
--> statement-breakpoint
ALTER TABLE `team_answer` DROP FOREIGN KEY `team_answer_question_id_question_id_fk`;
--> statement-breakpoint
ALTER TABLE `test` DROP FOREIGN KEY `test_user_id_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `test_attempt` DROP FOREIGN KEY `test_attempt_test_id_test_id_fk`;
--> statement-breakpoint
ALTER TABLE `team` ADD CONSTRAINT `team_attempt_id_test_attempt_id_fk` FOREIGN KEY (`attempt_id`) REFERENCES `test_attempt`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_answer` ADD CONSTRAINT `team_answer_team_id_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_answer` ADD CONSTRAINT `team_answer_question_id_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test` ADD CONSTRAINT `test_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_attempt` ADD CONSTRAINT `test_attempt_test_id_test_id_fk` FOREIGN KEY (`test_id`) REFERENCES `test`(`id`) ON DELETE cascade ON UPDATE no action;