package vazkii.quark.world.block;

import java.util.OptionalInt;
import java.util.Random;
import java.util.function.BooleanSupplier;

import net.minecraft.block.Block;
import net.minecraft.block.BlockState;
import net.minecraft.block.Blocks;
import net.minecraft.block.SaplingBlock;
import net.minecraft.block.trees.Tree;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemStack;
import net.minecraft.util.NonNullList;
import net.minecraft.world.gen.Heightmap;
import net.minecraft.world.gen.blockstateprovider.SimpleBlockStateProvider;
import net.minecraft.world.gen.feature.BaseTreeFeatureConfig;
import net.minecraft.world.gen.feature.ConfiguredFeature;
import net.minecraft.world.gen.feature.Feature;
import net.minecraft.world.gen.feature.TwoLayerFeature;
import net.minecraft.world.gen.foliageplacer.FancyFoliagePlacer;
import net.minecraft.world.gen.trunkplacer.FancyTrunkPlacer;
import vazkii.arl.util.RegistryHelper;
import vazkii.quark.base.block.IQuarkBlock;
import vazkii.quark.base.handler.RenderLayerHandler;
import vazkii.quark.base.handler.RenderLayerHandler.RenderTypeSkeleton;
import vazkii.quark.base.module.Module;

public class BlossomSaplingBlock extends SaplingBlock implements IQuarkBlock {

	private static final BlockState SPRUCE_LOG = Blocks.SPRUCE_LOG.getDefaultState();

	private final Module module;
	private BooleanSupplier enabledSupplier = () -> true;

	public BlossomSaplingBlock(String colorName, Module module, BlossomTree tree, Block leaf) {
		super(tree, Block.Properties.from(Blocks.OAK_SAPLING));
		this.module = module;

		RegistryHelper.registerBlock(this, colorName + "_blossom_sapling");
		RegistryHelper.setCreativeTab(this, ItemGroup.DECORATIONS);
		tree.sapling = this;
		
		RenderLayerHandler.setRenderType(this, RenderTypeSkeleton.CUTOUT);
	}

	@Override
	public void fillItemGroup(ItemGroup group, NonNullList<ItemStack> items) {
		if(isEnabled() || group == ItemGroup.SEARCH)
			super.fillItemGroup(group, items);
	}

	@Override
	public Module getModule() {
		return module;
	}

	@Override
	public BlossomSaplingBlock setCondition(BooleanSupplier enabledSupplier) {
		this.enabledSupplier = enabledSupplier;
		return this;
	}

	@Override
	public boolean doesConditionApply() {
		return enabledSupplier.getAsBoolean();
	}

	public static class BlossomTree extends Tree {

		public final BaseTreeFeatureConfig config;
		public final BlockState leaf;
		public BlossomSaplingBlock sapling;

		public BlossomTree(Block leafBlock) {
			config = (new BaseTreeFeatureConfig.Builder(
					new SimpleBlockStateProvider(Blocks.SPRUCE_LOG.getDefaultState()),
					new SimpleBlockStateProvider(leafBlock.getDefaultState()), 
					new FancyFoliagePlacer(2, 0, 4, 0, 4), 
					new FancyTrunkPlacer(3, 11, 0), 
					new TwoLayerFeature(0, 0, 0, OptionalInt.of(4))))
					.func_236700_a_().func_236702_a_(Heightmap.Type.MOTION_BLOCKING)
					.build();
			
			leaf = leafBlock.getDefaultState();
		}

		@Override
		protected ConfiguredFeature<BaseTreeFeatureConfig, ?> getTreeFeature(Random rand, boolean hjskfsd) {
			return Feature.field_236291_c_.withConfiguration(config); // tree
		}
		
	}

}
