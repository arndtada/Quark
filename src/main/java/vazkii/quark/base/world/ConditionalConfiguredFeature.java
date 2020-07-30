package vazkii.quark.base.world;

import java.util.Random;
import java.util.function.BooleanSupplier;

import net.minecraft.util.math.BlockPos;
import net.minecraft.world.ISeedReader;
import net.minecraft.world.gen.ChunkGenerator;
import net.minecraft.world.gen.feature.ConfiguredFeature;
import net.minecraft.world.gen.feature.Feature;
import net.minecraft.world.gen.feature.IFeatureConfig;
import net.minecraft.world.gen.feature.structure.StructureManager;

public class ConditionalConfiguredFeature<FC extends IFeatureConfig, F extends Feature<FC>> extends ConfiguredFeature<FC, F> {

	public final ConfiguredFeature<FC, F> parent;
	public final BooleanSupplier condition;
	
	public ConditionalConfiguredFeature(ConfiguredFeature<FC, F> parent, BooleanSupplier condition) {
		super(parent.feature, parent.config);
		this.parent = parent;
		this.condition = condition;
	}
	
	@Override // place
	public boolean func_236265_a_(ISeedReader p_236265_1_, StructureManager p_236265_2_, ChunkGenerator p_236265_3_, Random p_236265_4_, BlockPos p_236265_5_) {
		return condition.getAsBoolean() && super.func_236265_a_(p_236265_1_, p_236265_2_, p_236265_3_, p_236265_4_, p_236265_5_);
	}
	
}
