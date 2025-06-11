ALTER TABLE `question_matrix` MODIFY COLUMN `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `answer_variant` ADD `question_id` char(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `user_type` enum('admin','teacher','guest') NOT NULL;--> statement-breakpoint
ALTER TABLE `answer_variant` ADD CONSTRAINT `answer_variant_question_id_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question_matrix` DROP COLUMN `name`;