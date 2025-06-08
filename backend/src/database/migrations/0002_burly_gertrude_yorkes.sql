DROP TABLE `user_admin`;--> statement-breakpoint
ALTER TABLE `test` RENAME COLUMN `admin_id` TO `user_id`;--> statement-breakpoint
ALTER TABLE `test` DROP FOREIGN KEY `test_admin_id_user_admin_id_fk`;
--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `email` varchar(255);--> statement-breakpoint
ALTER TABLE `user` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `user` ADD `userType` enum('admin','teacher','student','guest') NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `test` ADD CONSTRAINT `test_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;