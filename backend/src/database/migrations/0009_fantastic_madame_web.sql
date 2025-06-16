ALTER TABLE `team_answer` DROP FOREIGN KEY `team_answer_variant_id_question_id_fk`;
--> statement-breakpoint
ALTER TABLE `team_answer` ADD CONSTRAINT `team_answer_variant_id_answer_variant_id_fk` FOREIGN KEY (`variant_id`) REFERENCES `answer_variant`(`id`) ON DELETE cascade ON UPDATE no action;