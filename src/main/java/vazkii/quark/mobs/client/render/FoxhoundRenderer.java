/**
 * This class was created by <WireSegal>. It's distributed as
 * part of the Quark Mod. Get the Source Code in github:
 * https://github.com/Vazkii/Quark
 * <p>
 * Quark is Open Source and distributed under the
 * CC-BY-NC-SA 3.0 License: https://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_GB
 * <p>
 * File Created @ [Jul 13, 2019, 13:30 AM (EST)]
 */
package vazkii.quark.mobs.client.render;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import net.minecraft.client.renderer.entity.EntityRendererManager;
import net.minecraft.client.renderer.entity.MobRenderer;
import net.minecraft.util.ResourceLocation;
import vazkii.quark.base.Quark;
import vazkii.quark.mobs.client.layer.FoxhoundCollarLayer;
import vazkii.quark.mobs.client.model.FoxhoundModel;
import vazkii.quark.mobs.entity.FoxhoundEntity;

public class FoxhoundRenderer extends MobRenderer<FoxhoundEntity, FoxhoundModel> {
	private static final ResourceLocation FOXHOUND_IDLE = new ResourceLocation(Quark.MOD_ID, "textures/model/entity/foxhound/idle.png");
	private static final ResourceLocation FOXHOUND_HOSTILE = new ResourceLocation(Quark.MOD_ID, "textures/model/entity/foxhound/hostile.png");
	private static final ResourceLocation FOXHOUND_SLEEPING = new ResourceLocation(Quark.MOD_ID, "textures/model/entity/foxhound/sleeping.png");

	public FoxhoundRenderer(EntityRendererManager render) {
		super(render, new FoxhoundModel(), 0.5F);
		addLayer(new FoxhoundCollarLayer(this));
	}

	@Nullable
	@Override
	public ResourceLocation getEntityTexture(@Nonnull FoxhoundEntity entity) {
		return entity.isSleeping() ? FOXHOUND_SLEEPING : (entity.func_230256_F__() > 0 ? FOXHOUND_HOSTILE : FOXHOUND_IDLE);
	}
}
