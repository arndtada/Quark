package vazkii.quark.building.module;

import java.util.LinkedList;
import java.util.List;

import net.minecraft.block.Block;
import net.minecraft.block.Blocks;
import vazkii.quark.base.handler.FuelHandler;
import vazkii.quark.base.handler.ItemOverrideHandler;
import vazkii.quark.base.handler.MiscUtil;
import vazkii.quark.base.module.Config;
import vazkii.quark.base.module.LoadModule;
import vazkii.quark.base.module.Module;
import vazkii.quark.base.module.ModuleCategory;
import vazkii.quark.building.block.IronLadderBlock;
import vazkii.quark.building.block.VariantLadderBlock;

@LoadModule(category = ModuleCategory.BUILDING)
public class VariantLaddersModule extends Module {

	@Config public static boolean changeNames = true;
	
	@Config(flag = "iron_ladder")
	public static boolean enableIronLadder = true;
	
	public static List<Block> variantLadders = new LinkedList<>();
	public static Block iron_ladder;

	@Override
	public void construct() {
		for(String type : MiscUtil.OVERWORLD_VARIANT_WOOD_TYPES)
			variantLadders.add(new VariantLadderBlock(type, this, true));
		for(String type : MiscUtil.NETHER_WOOD_TYPES)
			variantLadders.add(new VariantLadderBlock(type, this, false));
		
		iron_ladder = new IronLadderBlock(this);
	}
	
	@Override
	public void loadComplete() {
		variantLadders.forEach(FuelHandler::addWood);
	}

	@Override
	public void configChanged() {
		ItemOverrideHandler.changeBlockLocalizationKey(Blocks.LADDER, "block.quark.oak_ladder", changeNames && enabled);
	}
	
}
