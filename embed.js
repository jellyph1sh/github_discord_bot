import { EmbedBuilder } from "discord.js";

const embed = (title, color, desc, author) => {
    return new EmbedBuilder()
    .setTitle(title)
	.setColor(color)
	.setDescription(desc)
    .addFields(
        { name: 'Auteur', value: author },
    )
	.setTimestamp()
}

export default embed