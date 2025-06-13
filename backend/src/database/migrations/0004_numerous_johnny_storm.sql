ALTER TABLE `answer_variant` DROP FOREIGN KEY `answer_variant_question_id_question_id_fk`;
--> statement-breakpoint
ALTER TABLE `block` DROP FOREIGN KEY `block_test_id_test_id_fk`;
--> statement-breakpoint
ALTER TABLE `question` DROP FOREIGN KEY `question_block_id_block_id_fk`;
--> statement-breakpoint
ALTER TABLE `question_matrix` DROP FOREIGN KEY `question_matrix_block_id_block_id_fk`;
--> statement-breakpoint
ALTER TABLE `answer_variant` ADD CONSTRAINT `answer_variant_question_id_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `block` ADD CONSTRAINT `block_test_id_test_id_fk` FOREIGN KEY (`test_id`) REFERENCES `test`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question` ADD CONSTRAINT `question_block_id_block_id_fk` FOREIGN KEY (`block_id`) REFERENCES `block`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question_matrix` ADD CONSTRAINT `question_matrix_block_id_block_id_fk` FOREIGN KEY (`block_id`) REFERENCES `block`(`id`) ON DELETE cascade ON UPDATE no action;