package vazkii.quark.client.render.variant;

import net.minecraft.client.renderer.entity.ChickenRenderer;
import net.minecraft.client.renderer.entity.EntityRendererManager;
import net.minecraft.entity.passive.ChickenEntity;
import net.minecraft.util.ResourceLocation;
import vazkii.quark.client.module.VariantAnimalTexturesModule;
import vazkii.quark.client.module.VariantAnimalTexturesModule.VariantTextureType;

public class VariantChickenRenderer extends ChickenRenderer {

	public VariantChickenRenderer(EntityRendererManager renderManagerIn) {
		super(renderManagerIn);
	}
	
	@Override
	public ResourceLocation getEntityTexture(ChickenEntity entity) {
		return VariantAnimalTexturesModule.getTextureOrShiny(entity, VariantTextureType.CHICKEN, VariantAnimalTexturesModule.enableChicken);
	}
	
}
