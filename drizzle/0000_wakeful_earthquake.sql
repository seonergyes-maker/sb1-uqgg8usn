CREATE TABLE `automations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`trigger` varchar(100) NOT NULL,
	`conditions` text NOT NULL DEFAULT ('{}'),
	`actions` text NOT NULL DEFAULT ('{}'),
	`status` varchar(50) NOT NULL DEFAULT 'Inactiva',
	`execution_count` int NOT NULL DEFAULT 0,
	`success_rate` decimal(5,2) DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `automations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(20) NOT NULL DEFAULT 'user',
	`is_active` int NOT NULL DEFAULT 1,
	`plan` varchar(50) NOT NULL DEFAULT 'Starter',
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`contacts` int NOT NULL DEFAULT 0,
	`emails_sent` int NOT NULL DEFAULT 0,
	`registered_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'Campaña',
	`status` varchar(50) NOT NULL DEFAULT 'Borrador',
	`scheduled_for` timestamp,
	`sent_at` timestamp,
	`opens` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`bounces` int NOT NULL DEFAULT 0,
	`unsubscribes` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `landings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500),
	`description` text,
	`content` text NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'Borrador',
	`published_at` timestamp,
	`views` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`conversion_rate` decimal(5,2) DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `landings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`source` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'Nuevo',
	`score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`subscription_id` int,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'EUR',
	`payment_method` varchar(50) NOT NULL,
	`payment_status` varchar(50) NOT NULL DEFAULT 'pending',
	`transaction_id` varchar(255),
	`description` text,
	`metadata` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scheduled_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`task_type` varchar(100) NOT NULL,
	`reference_id` int,
	`reference_name` varchar(255),
	`scheduled_for` timestamp NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'Programada',
	`executed_at` timestamp,
	`result` text,
	`recurrence` varchar(50) NOT NULL DEFAULT 'none',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scheduled_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `segments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`filters` text NOT NULL,
	`lead_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `segments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company_name` varchar(255) NOT NULL DEFAULT 'LandFlow',
	`contact_email` varchar(255) NOT NULL DEFAULT 'soporte@landflow.com',
	`phone` varchar(50) NOT NULL DEFAULT '+34 900 000 000',
	`from_name` varchar(255) NOT NULL DEFAULT 'LandFlow',
	`from_email` varchar(255) NOT NULL DEFAULT 'noreply@landflow.com',
	`reply_to_email` varchar(255) NOT NULL DEFAULT 'soporte@landflow.com',
	`smtp_host` varchar(255),
	`smtp_port` int DEFAULT 587,
	`smtp_user` varchar(255),
	`smtp_password` varchar(255),
	`smtp_encryption` varchar(10) DEFAULT 'tls',
	`smtp_auth` varchar(20) DEFAULT 'login',
	`notify_new_clients` int NOT NULL DEFAULT 1,
	`notify_payments` int NOT NULL DEFAULT 1,
	`notify_failed_payments` int NOT NULL DEFAULT 1,
	`notify_cancellations` int NOT NULL DEFAULT 1,
	`stripe_key` varchar(255),
	`paypal_client_id` varchar(255),
	`analytics_id` varchar(100),
	`terms_and_conditions` text,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`plan` varchar(50) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`start_date` date NOT NULL,
	`next_billing` date,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` varchar(50) NOT NULL,
	`category` varchar(100) NOT NULL,
	`subject` varchar(500),
	`content` text NOT NULL,
	`variables` text,
	`thumbnail` varchar(500),
	`status` varchar(50) NOT NULL DEFAULT 'Activa',
	`times_used` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unsubscribes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lead_id` int,
	`client_id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`reason` text,
	`unsubscribed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unsubscribes_id` PRIMARY KEY(`id`)
);
