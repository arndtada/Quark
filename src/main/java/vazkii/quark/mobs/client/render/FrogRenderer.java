package vazkii.quark.mobs.client.render;

import net.minecraft.client.renderer.entity.EntityRendererManager;
import net.minecraft.client.renderer.entity.MobRenderer;
import net.minecraft.util.ResourceLocation;
import vazkii.quark.mobs.client.model.FrogModel;
import vazkii.quark.mobs.entity.FrogEntity;

import javax.annotation.Nonnull;

public class FrogRenderer extends MobRenderer<FrogEntity, FrogModel> {

	private static final ResourceLocation TEXTURE = new ResourceLocation("quark", "textures/model/entity/frog.png");
	private static final ResourceLocation TEXTURE_SWEATER = new ResourceLocation("quark", "textures/model/entity/events/sweater_frog.png");
	private static final ResourceLocation TEXTURE_FUNNY = new ResourceLocation("quark", "textures/model/entity/events/funny_rat_frog.png");
	private static final ResourceLocation TEXTURE_SNAKE = new ResourceLocation("quark", "textures/model/entity/events/snake_block_frog.png");
	private static final ResourceLocation TEXTURE_KERMIT = new ResourceLocation("quark", "textures/model/entity/events/kermit_frog.png");

	public FrogRenderer(EntityRendererManager manager) {
		super(manager, new FrogModel(), 0.2F);
	}

	@Override
	public ResourceLocation getEntityTexture(@Nonnull FrogEntity entity) {
		if (entity.hasCustomName()) {
			String name = entity.getCustomName().getString().trim();
			if(name.equalsIgnoreCase("Alex") || name.equalsIgnoreCase("Rat") || name.equalsIgnoreCase("Funny Rat"))
				return TEXTURE_FUNNY;
			if(name.equalsIgnoreCase("Snake") || name.equalsIgnoreCase("SnakeBlock") || name.equalsIgnoreCase("Snake Block"))
				return TEXTURE_SNAKE;
			if(name.equalsIgnoreCase("Kermit"))
				return TEXTURE_KERMIT;
		}
		return entity.hasSweater() ? TEXTURE_SWEATER : TEXTURE;
	}

}
